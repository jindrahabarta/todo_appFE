const PlusIco = ({
    className,
    handleClick,
}: {
    className?: string
    handleClick?: () => void
}) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className={className}
            onClick={handleClick}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 12h16m-8-8v16'
            />
        </svg>
    )
}

export default PlusIco
