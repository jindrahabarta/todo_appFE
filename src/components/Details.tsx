import { useContext } from 'react'
import { TodoCardsContext } from '../context/TodoCardsContext'
import PlusIco from '../icons/PlusIco'

const Details = ({
    selectedId,
    className,
    handleClick,
    header,
}: {
    selectedId: string
    className?: string
    handleClick: () => void
    header: string
}) => {
    const { todoCards } = useContext(TodoCardsContext)

    const findTodo = todoCards.find((todo) => {
        return todo.id === selectedId
    })

    let time
    if (findTodo) {
        time = new Date(findTodo.timestamp)
    }

    return (
        <div
            className={`${className} cursor-default p-4 hidden bg-gray-100 border-2 border-gray-200 shadow-md rounded-tl-lg rounded-bl-lg w-full sm:w-96 h-full absolute right-0 top-0 z-50`}
        >
            <div className='flex flex-col gap-2 break-all'>
                <div
                    onClick={handleClick}
                    className='w-fit self-end  hover:cursor-pointer'
                >
                    <PlusIco className=' stroke-black w-8 rotate-45 duration-200'></PlusIco>
                </div>

                <h1>
                    {header} - {findTodo?.title}
                </h1>
                <p className='text-sm'>
                    Přidáno:{' '}
                    {time?.getDate() +
                        '. ' +
                        time?.getMonth() +
                        '. ' +
                        time?.getFullYear() +
                        ' ' +
                        time?.getHours() +
                        ':' +
                        time?.getMinutes()}
                </p>
                <p>{findTodo?.description}</p>

                {findTodo?.image && (
                    <div className='w-full h-fit flex gap-1 '>
                        <div className=' w-1/3 h-fit rounded-lg overflow-hidden'>
                            <img src={findTodo.image} alt={findTodo.image} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Details
