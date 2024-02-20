import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'

const SellerOrders = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState()
    const [showPage, setShowPage] = useState("all")
    const [orderDetails, setOrderDetails] = useState()
    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/seller/home/view-orders", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                console.log(res)
                setOrders(res.data.sellerOrders)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

    const formatTime = (time) => {
        const createdAt = new Date(time);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = createdAt.toLocaleDateString('en-IN', options);

        return formattedDate;

    }

    return (
        <div>
            {orders ? <div className="h-full pb-20 min-h-[90vh] bg-gray-100 pt-10">
                <h1 className=" mb-10 text-center text-3xl font-semibold">Orders</h1>
                <div className="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="rounded-lg md:w-full">
                        <div className="rounded-lg bg-white p-6 py-8 shadow-md flex flex-col mb-3">
                            <table className="table-fixed text-left mx-5 ">
                                <thead className='text-lg '>
                                    <tr>
                                        <th className='mb-3 pl-3'>Order ID</th>
                                        <th className='mb-3'>Customer Name</th>
                                        <th className='mb-3'>Customer Phone</th>
                                        <th className='mb-3'>Ordered Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className='hover:bg-stone-200 cursor-pointer' onClick={() => (navigate(`/shoppingApp/seller/view-orders/${order._id}`))}>
                                            <td className='px-3 py-2 w-[25%]'>{order._id}</td>
                                            <td className='py-2 w-[25%]'>{order.customer.name}</td>
                                            <td className='py-2 w-[25%]'>{order.customer.phone}</td>
                                            <td className='py-2 w-[20%]'>{formatTime(order.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> : <LoadingSpinner />}

        </div>
    )
}

export default SellerOrders