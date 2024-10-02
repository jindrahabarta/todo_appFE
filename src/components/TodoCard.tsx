import DotsIco from '../icons/DotsIco'
import { MouseEventHandler, useState } from 'react'
import TodoCardMenu from './TodoCardMenu'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface props {
    id: string
    title: string
    description: string
    image?: string
    handleClick?: (id: string) => void
}

const TodoCard = ({ title, description, image, id, handleClick }: props) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [menuPosition, setMenuPosition] = useState({
        x: 0,
        y: 0,
    })

    const menuHandler: MouseEventHandler<HTMLDivElement> = (e) => {
        setMenuPosition({
            x: e.clientX,
            y: e.clientY,
        })
        setMenuOpened((prev) => !prev)
    }

    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: 'transform 0.3s ease, opacity 0.3s ease, border 0.3s ease',
        opacity: isDragging ? 0.5 : 1,
        border: isDragging ? 'red solid' : '#e5e7eb solid',
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            id={id}
            className='bg-white border-2 border-gray-200 w-full h-fit flex items-center justify-between  p-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing active:shadow-none duration-200'
        >
            <div>
                <div>
                    <h2>{title}</h2>
                    <p className='text-gray-600 break-all w-full line-clamp-2'>
                        {description}
                    </p>
                </div>

                {image && (
                    <div className='w-full h-fit flex gap-1'>
                        <div className='w-1/3 h-fit rounded-lg overflow-hidden'>
                            <img src={image} alt={image} />
                        </div>
                    </div>
                )}

                <div
                    id={id}
                    onClick={() => {
                        if (handleClick === undefined) return
                        handleClick(id)
                    }}
                    className='seeMoreBtn hover:cursor-pointer mt-2 w-fit group'
                >
                    <p className='text-sm text-gray-400 group-hover:text-gray-700 duration-200 pointer-events-none'>
                        více
                    </p>
                </div>
            </div>

            <div
                onClick={menuHandler}
                onMouseLeave={() => setMenuOpened(false)}
                className=' cursor-pointer group p-1 relative  h-fit'
            >
                <DotsIco className='fill-gray-400 group-hover:fill-gray-600 duration-200 w-4'></DotsIco>
                {menuOpened && (
                    <TodoCardMenu
                        position={menuPosition}
                        id={id}
                    ></TodoCardMenu>
                )}
            </div>
        </div>
    )
}

export default TodoCard
