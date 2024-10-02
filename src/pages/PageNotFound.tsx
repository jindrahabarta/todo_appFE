import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className='h-screen flex items-center justify-center'>
            <div>
                <h1>Error 404</h1>
                <Link to='/'>Go Back!</Link>
            </div>
        </div>
    )
}

export default PageNotFound
