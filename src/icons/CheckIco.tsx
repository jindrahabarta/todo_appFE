const CheckIco = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 12.611 8.923 17.5 20 6.5'
            />
        </svg>
    )
}

export default CheckIco
