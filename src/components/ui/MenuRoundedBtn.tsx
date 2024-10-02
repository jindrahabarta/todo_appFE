import { ReactElement } from 'react'

interface props {
    className?: string
    handleClick?: () => void
    children?: ReactElement
}

const MenuRoundedBtn = ({ className, handleClick, children }: props) => {
    return (
        <div
            onClick={handleClick}
            className={`${className}  group/button duration-200 rounded-full w-10 h-10 shadow-lg flex items-center justify-center`}
        >
            {children}
        </div>
    )
}

export default MenuRoundedBtn
