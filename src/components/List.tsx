import React, {
    ChangeEventHandler,
    useContext,
    useEffect,
    useState,
} from 'react'
import TodoCard from './TodoCard'
import { useDroppable } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import AddTodoForm from './AddTodoForm'
import { TodoCardsContext } from '../context/TodoCardsContext'
import EditTodoForm from './EditTodoForm'
import SortList, { SortBy } from '../utils/SortList'
import Details from './Details'
import ArrowIco from '../icons/ArrowIco'
import PlusIco from '../icons/PlusIco'
import axios from 'axios'
import { ListsContext } from '../context/ListsContext'
import showOfflineAlert from '../utils/showOfflineAlert'

interface props {
    header: string
    id: string
    todos: todoCard[]
}
interface todoCard {
    id: string
    listId: string
    timestamp: number
    title: string
    description: string
    image?: string
}

const List = ({ header, id, todos }: props) => {
    const { todoCards } = useContext(TodoCardsContext)
    const { setLists } = useContext(ListsContext)
    const [currentTodos, setCurrentTodos] = useState(todos)

    const [listShowed, setListShowed] = useState(true)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [selectedId, setSelectedId] = useState('')

    useEffect(() => {
        setCurrentTodos(todos)
    }, [todos, todoCards])

    const sortList: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setCurrentTodos([...SortList(e.target.value as SortBy, currentTodos)])
    }

    const showDetails = (currentId: string) => {
        if (selectedId !== currentId) {
            setDetailsVisible(true)
            setSelectedId(currentId)
        } else {
            setDetailsVisible(false)
            setSelectedId('')
        }
    }

    const deleteList = () => {
        axios
            .delete('http://localhost:3000/lists/' + id)
            .then((res) => {
                setLists(res.data)
            })
            .catch((error) => {
                if (error.code === 'ERR_NETWORK') {
                    showOfflineAlert(true)
                }
            })
    }

    const { setNodeRef } = useDroppable({
        id,
    })

    return (
        <SortableContext items={currentTodos} strategy={rectSortingStrategy}>
            <div
                ref={setNodeRef}
                id={id}
                style={
                    listShowed
                        ? { height: 'fit-content', overflow: 'visible' }
                        : { height: 60, overflow: 'hidden' }
                }
                className={`bg-gray-200 ${
                    id === 'done' && 'bg-green-200 pb-4'
                }  duration-200 sm:min-w-80 h-fit  sm:max-w-80  shadow-md rounded-lg p-4 pb-1 flex flex-col gap-2 `}
            >
                <div className='flex justify-between items-center'>
                    <h1>{header}</h1>

                    <div className='flex items-center'>
                        <button onClick={() => setListShowed((prev) => !prev)}>
                            <ArrowIco
                                className={`${
                                    !listShowed && '-rotate-180'
                                } duration-200 fill-gray-400 hover:fill-black w-6`}
                            ></ArrowIco>
                        </button>
                        {id !== 'done' && (
                            <button onClick={deleteList}>
                                <PlusIco
                                    className={` rotate-45 stroke-gray-400 hover:stroke-black duration-200 w-5`}
                                ></PlusIco>
                            </button>
                        )}
                    </div>
                </div>

                <div className='flex gap-1 items-baseline justify-end'>
                    <label htmlFor={id + '-sortby'}>Seřadit:</label>
                    <select
                        onChange={sortList}
                        className='bg-transparent'
                        name={id + '-sortby'}
                        id={id + '-sortby'}
                    >
                        <option value={SortBy.newest}>Nejnovější</option>
                        <option value={SortBy.alphabet}>Abecedně</option>
                        <option value={SortBy.random}>Random</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 '>
                    {currentTodos.map((todo) => (
                        <React.Fragment key={todo.id}>
                            <TodoCard
                                handleClick={showDetails}
                                id={todo.id}
                                title={todo.title}
                                description={todo.description}
                                image={todo.image}
                            ></TodoCard>
                        </React.Fragment>
                    ))}
                </div>

                {id !== 'done' && <AddTodoForm formId={id}></AddTodoForm>}

                <Details
                    className={
                        detailsVisible ? 'detailsCardOpen' : 'detailsCardClose'
                    }
                    handleClick={() => {
                        setDetailsVisible(false)
                        setSelectedId('')
                    }}
                    header={header}
                    selectedId={selectedId}
                ></Details>

                <EditTodoForm></EditTodoForm>
            </div>
        </SortableContext>
    )
}

export default List
