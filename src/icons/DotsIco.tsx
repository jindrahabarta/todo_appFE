const DotsIco = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 16 16'
            className={className}
        >
            <g>
                <path d='M8 12a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 2a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z' />
            </g>
        </svg>
    )
}

export default DotsIco
