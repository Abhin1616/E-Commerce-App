import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'

const SellerViewSingleOrder = () => {
    const [orderDetails, setOrderDetails] = useState()
    const { orderId } = useParams()
    useEffect(() => {
        axios.get(`http://localhost:3000/shoppingApp/seller/home/view-orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                console.log(res)
                setOrderDetails(res.data)

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
            {orderDetails ? <div className="h-full pb-20 min-h-[90vh] bg-gray-100 pt-10">
                <h1 className=" mb-10 text-center text-3xl font-semibold">Order Details</h1>
                <div className="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="rounded-lg md:w-full">
                        <div className="rounded-lg bg-white p-6 py-8 shadow-md flex flex-col mb-3">
                            <div className='mb-2'><span className='font-semibold'>Order ID:</span> #{orderDetails._id}</div>
                            <div className='mb-5'><span className='font-semibold text-lg'>Ordered At: </span>{formatTime(orderDetails.createdAt)}</div>
                            <div className='mb-4'>
                                <h2 className='text-xl font-bold mb-3'>Customer Details</h2>
                                <div className='text-lg'>
                                    <h2>Name: {orderDetails.customer.name}</h2>
                                    <h2>Phone: {orderDetails.customer.phone}</h2>
                                </div>
                            </div>
                            <div className='mb-4'>
                                <h2 className='text-xl font-bold mb-6'>Shipping Address</h2>
                                <div className='border border-black px-2 py-3'>
                                    <label className='text-lg '><small className='bg-gray-300 text-xs p-1 rounded-xl text-gray-600'>{orderDetails.shippingAddress.addressType}</small><br /><span className='font-medium'>Phone: {orderDetails.shippingAddress.phone}</span><br />{orderDetails.shippingAddress.buildingName}, {orderDetails.shippingAddress.street}, {orderDetails.shippingAddress.district}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.pincode}<br />{orderDetails.shippingAddress.landmark && orderDetails.shippingAddress.landmark}</label>
                                </div>

                            </div>
                            <div className='mb-6'>
                                <h2 className='text-xl font-bold mb-6'>Ordered Products</h2>
                                {orderDetails.products.map((products, productIndex) => (
                                    <div key={productIndex} className='flex my-2 border border-gray-300 py-2 items-center justify-between'>
                                        <div className='flex items-center'>
                                            <Link to={`/shoppingApp/seller/view-product/${products.product._id}`} className='w-[150px] flex justify-center'>
                                                <img style={{ height: "100px", width: "auto" }} src={products.product.image[0].url} alt="" />
                                            </Link>
                                            <div>
                                                <div>
                                                    Product Name: <span className='text-base font-semibold'>
                                                        {products.product.productName.length > 25 ? products.product.productName.substring(0, 25) + '...' : products.product.productName}
                                                    </span>
                                                </div>
                                                <div>
                                                    Price: <span className='text-base font-semibold'>{products.product.price}</span>
                                                </div>
                                                <div>
                                                    Quantity: <span className='text-base font-semibold mb-2'>{products.quantity}</span>
                                                </div>
                                                <div>
                                                    Total: <span className='text-lg font-bold'>{products.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <LoadingSpinner />
            }
        </div>
    )
}

export default SellerViewSingleOrder