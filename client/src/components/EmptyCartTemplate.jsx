import React from 'react'
import emptyCartImg from "./emptyCart.png"
import { useNavigate } from 'react-router-dom'

const EmptyCartTemplate = () => {
    const navigate = useNavigate()
    return (
        <div className='flex items-center justify-center'>
            <div className='h-[60vh] w-3/5 bg-white flex flex-col items-center justify-center rounded-lg'>
                <img className='w-[150px] mr-7' src={emptyCartImg} alt="" />
                <h3 className='font-semibold text-xl'>Add something to make me happy :)</h3>
                <button className='mt-20 rounded-lg border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700' onClick={() => (navigate("/shoppingApp/home"))}>Continue Shopping</button>
            </div>
        </div>
    )
}

export default EmptyCartTemplate