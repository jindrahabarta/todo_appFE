import { createContext } from 'react'

interface lists {
    id: string
    title: string
}

export const ListsContext = createContext<{
    lists: lists[]
    setLists: (value: lists[]) => void
}>({
    lists: [],
    setLists: () => {},
})
