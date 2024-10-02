import { createContext } from 'react'

interface todoCards {
    id: string
    listId: string
    timestamp: number
    title: string
    description: string
    image?: string
}

export const TodoCardsContext = createContext<{
    todoCards: todoCards[]
    setTodoCards: (value: todoCards[]) => void
}>({
    todoCards: [],
    setTodoCards: () => {},
})
