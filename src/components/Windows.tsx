import List from './List'
import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
import Loader from './ui/Loader'
import { ListsContext } from '../context/ListsContext'
import { TodoCardsContext } from '../context/TodoCardsContext'
import AddListForm from './AddListForm'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import TodoCard from './TodoCard'
import axios from 'axios'
import TaskDoneBin from './ui/TaskDoneBin'
import showOfflineAlert from '../utils/showOfflineAlert'

interface list {
    id: string
    title: string
}
interface todoCard {
    id: string
    listId: string
    timestamp: number
    title: string
    description: string
    image?: string
}

const Windows = () => {
    const [lists, setLists] = useState<list[]>([])
    const [todoCards, setTodoCards] = useState<todoCard[]>([])
    const [activeCard, setActiveCard] = useState<todoCard | null>(null)

    const {
        data: listsData,
        isLoading: listsLoading,
        error: listsError,
    } = useFetch<list[]>('https://adminbe.onrender.com/lists')

    const {
        data: todosData,
        isLoading: todosLoading,
        error: todosError,
    } = useFetch<todoCard[]>('https://adminbe.onrender.com/todos')

    useEffect(() => {
        if (!listsLoading) {
            if (listsError) {
                showOfflineAlert(true)
                const localListsData = window.localStorage.getItem('lists')
                if (localListsData) {
                    setLists(JSON.parse(localListsData))
                }
            } else {
                window.localStorage.setItem('lists', JSON.stringify(listsData))
                setLists(listsData)
            }
        }
    }, [listsData, listsError, listsLoading])

    useEffect(() => {
        if (!todosLoading) {
            if (todosError) {
                showOfflineAlert(true)
                const localTodosData = window.localStorage.getItem('todos')
                if (localTodosData) {
                    setTodoCards(JSON.parse(localTodosData))
                }
            } else {
                window.localStorage.setItem('todos', JSON.stringify(todosData))
                setTodoCards(todosData)
            }
        }
    }, [todosData, todosError, todosLoading])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0.8,
            },
        }),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event

        const draggedCard: todoCard | undefined = todoCards.find(
            (card) => card.id === active.id
        )
        setActiveCard(draggedCard ? draggedCard : null)
    }
    let updatedCards: todoCard[] = []
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        const activeCardIndex = todoCards.findIndex(
            (card) => card.id === active.id
        )

        if (activeCardIndex === -1) {
            console.error('Přetažená karta neexistuje.')
            return
        }

        const isOverList = lists.some((list) => list.id === over.id)

        if (isOverList) {
            const newListId = over.id

            if (todoCards[activeCardIndex].listId !== newListId) {
                updatedCards = [...todoCards]

                updatedCards[activeCardIndex] = {
                    ...updatedCards[activeCardIndex],
                    listId: newListId.toString(),
                }
                setTodoCards(updatedCards)
            }
        } else {
            const overCardIndex = todoCards.findIndex(
                (card) => card.id === over.id
            )

            if (over.id === 'taskDoneBin') {
                return
            } else {
                if (overCardIndex === -1) {
                    console.error('Cílová karta neexistuje.')
                    return
                }
            }

            if (
                todoCards[activeCardIndex].listId ===
                todoCards[overCardIndex].listId
            ) {
                updatedCards = [...todoCards]

                const [movedCard] = updatedCards.splice(activeCardIndex, 1)
                updatedCards.splice(overCardIndex, 0, movedCard)

                setTodoCards(updatedCards)
            }
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over?.id === 'taskDoneBin') {
            axios
                .post('https://adminbe.onrender.com/todos/markDone', {
                    id: active.id,
                })
                .then((res) => {
                    if (res.status === 200) {
                        setTodoCards(res.data)
                    }
                })
                .catch((error) => {
                    if (error.code === 'ERR_NETWORK') {
                        showOfflineAlert(true)
                    }
                })
        } else {
            window.localStorage.setItem('todos', JSON.stringify(todoCards))
            axios
                .put('https://adminbe.onrender.com/todos', todoCards)
                .then(() => {
                    // setTodoCards(res.data)
                })
                .catch((error) => {
                    if (error.code === 'ERR_NETWORK') {
                        showOfflineAlert(true)
                    }
                })
        }

        setActiveCard(null)
    }

    return (
        <TodoCardsContext.Provider value={{ todoCards, setTodoCards }}>
            <ListsContext.Provider value={{ lists, setLists }}>
                <div className='p-2 sm:p-4 ${} w-full h-full flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto'>
                    {listsLoading ? (
                        <Loader />
                    ) : lists.length === 0 ? (
                        <h1>Přidej svůj první list</h1>
                    ) : (
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                        >
                            {lists.map((list) => (
                                <React.Fragment key={list.id}>
                                    <List
                                        id={list.id}
                                        header={list.title}
                                        todos={todoCards.filter(
                                            (todo) => todo.listId === list.id
                                        )}
                                    ></List>
                                </React.Fragment>
                            ))}
                            {activeCard && (
                                <DragOverlay>
                                    {activeCard && (
                                        <TodoCard
                                            id='aciveCard'
                                            title={activeCard.title}
                                            description={activeCard.description}
                                        ></TodoCard>
                                    )}
                                </DragOverlay>
                            )}
                            <TaskDoneBin
                                visible={activeCard === null ? false : true}
                            ></TaskDoneBin>
                        </DndContext>
                    )}

                    {!listsLoading && <AddListForm></AddListForm>}
                </div>
            </ListsContext.Provider>
        </TodoCardsContext.Provider>
    )
}

export default Windows
