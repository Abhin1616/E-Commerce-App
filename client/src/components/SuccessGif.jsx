import React from 'react'
import "./SuccessGif.css"
import successGif from './successGif.gif'
import confettiGif from './confetti.gif'
import { useNavigate } from 'react-router-dom'
const SuccessGif = () => {
    const navigate = useNavigate()
    return (
        <div>
            <img className='ConfettiGifImage' src={confettiGif} alt="Loading..." />
            <div className="SuccessGif">
                <img className='SuccessGifImage' src={successGif} alt="Loading..." />
                <div className='text-xl font-semibold font-sans'>ORDER PLACED SUCCESSFULLY</div>
                <div className='mt-5'><button className='lex items-center justify-center rounded-full border border-transparent bg-indigo-600 px-5 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-900 ' onClick={() => (navigate("/shoppingApp/home"))} style={{ transition: "0.3s" }}>Back to Home</button></div>
            </div>
        </div>

    )
}

export default SuccessGif