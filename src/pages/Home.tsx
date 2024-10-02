import OfflineModeError from '../components/ui/OfflineModeError'
import Windows from '../components/Windows'

const Home = () => {
    return (
        <div className='h-screen w-screen'>
            <Windows></Windows>
            <OfflineModeError></OfflineModeError>
        </div>
    )
}

export default Home
