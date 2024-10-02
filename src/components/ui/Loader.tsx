import LoaderImg from '/loader.gif'
import './loader.css'

const Loader = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center cursor-default">
            <div>
                <img className="w-24" src={LoaderImg} alt="Loader gif" />
                <p className="text-center">
                    Loading <span id="dot-1">.</span>
                    <span id="dot-2">.</span>
                    <span id="dot-3">.</span>
                </p>
            </div>
        </div>
    )
}

export default Loader
