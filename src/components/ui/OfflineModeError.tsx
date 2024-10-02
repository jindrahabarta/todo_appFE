import showOfflineAlert from '../../utils/showOfflineAlert'

const OfflineModeError = () => {
    return (
        <button
            onClick={() => showOfflineAlert(false)}
            id='offlineAlert'
            className='hidden opacity-0 fixed left-2 sm:left-4 bottom-4  items-center justify-center gap-2 bg-gray-600 border-gray-600 border-2 border-opacity-25 bg-opacity-40 backdrop-blur-sm shadow-sm py-4 px-8 rounded-lg'
        >
            <p>Jsi offline</p>
            <div
                id='offlineAlertDot'
                className='w-3 h-3 bg-red-500 rounded-full'
            ></div>
        </button>
    )
}

export default OfflineModeError
