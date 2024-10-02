import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import PageNotFound from './pages/PageNotFound'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home></Home>}></Route>
                <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
