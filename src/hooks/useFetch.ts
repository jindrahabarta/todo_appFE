import axios from 'axios'
import { useEffect, useState } from 'react'

const useFetch = <T extends unknown[]>(url: string) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        setIsLoading(true)

        axios
            .get(url)
            .then((res) => {
                setData(res.data)
            })
            .catch(() => {
                setError(true)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [url])

    return { data, isLoading, error } as unknown as {
        data: T
        isLoading: boolean
        error: boolean
    }
}

export default useFetch
