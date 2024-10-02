import { useDroppable } from '@dnd-kit/core'
import BasketPart1 from '/basket-part1.png'
import BasketPart2 from '/basket-part2.png'
import gsap from 'gsap'
import { useEffect } from 'react'

const TaskDoneBin = ({ visible }: { visible: boolean }) => {
    const { setNodeRef } = useDroppable({ id: 'taskDoneBin' })

    useEffect(() => {
        const tl = gsap.timeline({
            defaults: {
                duration: 1,
            },
        })

        if (visible) {
            tl.set('#taskDoneBin', {
                display: 'block',
            })
                .to('#taskDoneBin', {
                    opacity: 1,
                    duration: 0.2,
                })
                .to('#basketTop', {
                    rotate: 20,
                    x: 10,
                    duration: 0.3,
                })
        } else {
            gsap.to('#basketTop', {
                rotate: 0,
                x: 0,
            })

            gsap.to('#taskDoneBin', {
                display: 'none',
                opacity: 0,
                duration: 0.2,
            })
        }
    }, [visible])

    return (
        <div
            ref={setNodeRef}
            id='taskDoneBin'
            className={`fixed w-40 aspect-square bottom-2 right-2 opacity-0 hidden z-50`}
        >
            <div className='w-full h-full relative overflow-hidden'>
                <img
                    className='absolute top-0 left-0'
                    src={BasketPart2}
                    alt='basketimg2'
                />
                <img
                    id='basketTop'
                    className='absolute top-0 left-0'
                    src={BasketPart1}
                    alt='basketimg'
                />
            </div>
        </div>
    )
}

export default TaskDoneBin
