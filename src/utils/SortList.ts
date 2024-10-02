export enum SortBy {
    'newest' = 'newest',
    'alphabet' = 'alphabet',
    'random' = 'random',
}

/**
 *
 * @param sortBy - method
 * @param currentTodoCards - what you wanna sort
 * @returns sorted todo cards
 */

const SortList = (
    sortBy: SortBy,
    currentTodoCards: {
        id: string
        listId: string
        timestamp: number
        title: string
        description: string
        image?: string
    }[]
) => {
    let sorted = currentTodoCards
    if (sortBy === SortBy.newest) {
        sorted = sorted.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime()
            const dateB = new Date(b.timestamp).getTime()

            return dateB - dateA
        })
    } else if (sortBy === SortBy.alphabet) {
        sorted = sorted.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1
            }
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1
            }
            return 0
        })
    } else if (sortBy === SortBy.random) {
        for (let i = 0; i < sorted.length; i++) {
            const random = Math.floor(Math.random() * (i + 1))
            const temp = sorted[i]
            sorted[i] = sorted[random]
            sorted[random] = temp
        }
    }

    return sorted
}

export default SortList
