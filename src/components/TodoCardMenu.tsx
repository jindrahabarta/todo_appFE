import axios from 'axios'
import CheckIco from '../icons/CheckIco'
import PenIco from '../icons/PenIco'
import PlusIco from '../icons/PlusIco'
import MenuRoundedBtn from './ui/MenuRoundedBtn'
import { useContext } from 'react'
import { TodoCardsContext } from '../context/TodoCardsContext'
import showOfflineAlert from '../utils/showOfflineAlert'

const TodoCardMenu = ({
    id,
    position,
}: {
    id: string
    position: { x: number; y: number }
}) => {
    const { setTodoCards } = useContext(TodoCardsContext)

    const editCard = () => {
        window.localStorage.setItem('currentId', id)

        const editCardInput = document.querySelector('#editCardInput')

        editCardInput?.classList.add('editCardInputShow')
        editCardInput?.classList.remove('editCardInputHide')
    }

    const deleteCard = () => {
        axios
            .delete('http://localhost:3000/todos/' + id)
            .then((res) => {
                setTodoCards(res.data)
            })
            .catch((err) => {
                if (err.code === 'ERR_NETWORK') {
                    showOfflineAlert(true)
                }
            })
    }

    const markDone = () => {
        const selected = { id: id }

        axios
            .post('http://localhost:3000/todos/markDone', selected)
            .then((res) => {
                if (res.status === 200) {
                    setTodoCards(res.data)
                }
            })
            .catch((err) => {
                if (err.code === 'ERR_NETWORK') {
                    showOfflineAlert(true)
                }
            })
    }

    return (
        <div
            className={` cardMenu pr-10 w-fit h-fit absolute ${
                'top-' + position.y
            } ${
                'left-' + position.x
            } -translate-y-2/3 -translate-x-2/3  flex flex-col items-end justify-center`}
        >
            <MenuRoundedBtn
                handleClick={editCard}
                className='bg-amber-200 hover:bg-amber-200'
            >
                <PenIco className='fill-gray-400 group-hover/button:fill-amber-500 duration-200 w-5' />
            </MenuRoundedBtn>
            <MenuRoundedBtn
                handleClick={markDone}
                className='mr-6 bg-green-100 hover:bg-green-200'
            >
                <CheckIco className='stroke-gray-400 group-hover/button:stroke-green-500 duration-200 w-5'></CheckIco>
            </MenuRoundedBtn>
            <MenuRoundedBtn
                handleClick={deleteCard}
                className=' bg-red-100 hover:bg-red-200'
            >
                <PlusIco className='stroke-gray-400 group-hover/button:stroke-red-500 duration-200 w-5 rotate-45'></PlusIco>
            </MenuRoundedBtn>
        </div>
    )
}

export default TodoCardMenu
