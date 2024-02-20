import axios, { all } from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CustomerOrders = () => {
    const [allOrderedProducts, setAllOrderedProducts] = useState()
    const [otherDetails, setOtherDetails] = useState()
    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/customer/home/products/order-history", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                console.log(res)
                setAllOrderedProducts(res.data.allOrderedProducts)
                setOtherDetails(res.data.otherDetails)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    return (
        <div>
            {allOrderedProducts && otherDetails &&
                <div className="h-full min-h-[90vh] bg-gray-100 pt-10 ">
                    <h1 className=" mb-10 text-center text-3xl font-semibold">Orders</h1>
                    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                        <div className="rounded-lg md:w-full">
                            {allOrderedProducts.map((order, index) => (
                                <div key={index} className="rounded-lg bg-white p-6 shadow-md flex flex-col mb-10">
                                    <div>
                                        {otherDetails[index] && (
                                            <div className='mb-10 text-lg font-semibold'>
                                                <small className=' text-gray-500'>ID: #{otherDetails[index][3]}</small>
                                                <div className='mt-3 mb-10'>
                                                    <span className='text-gray-600'> {otherDetails[index][2]}</span>
                                                    <h2 className='text-xl font-bold mb-6'>Payment Details</h2>
                                                    <table class="table-auto">
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px' }}><span className='text-base'>Total Amount:</span></td>
                                                                <td className='ml-3'>₹{otherDetails[index][0].totalPrice}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px' }}><span className='text-base'>Amount Payed:</span></td>
                                                                <td className='ml-3 text-green-700'>₹{otherDetails[index][0].payedPrice}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px' }}><span className='text-base'>Amount Saved:</span> </td>
                                                                <td className='ml-3 text-green-700'>₹{otherDetails[index][0].totalPrice - otherDetails[index][0].payedPrice}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px' }}><span className='text-base'>Payment Method:</span> </td>
                                                                <td className='ml-3'>{otherDetails[index][0].paymentMethod}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className='mb-4'>
                                                    <h2 className='text-xl font-bold mb-6'>Shipping Address</h2>
                                                    <div className='border border-black px-2 py-3'>
                                                        <label className='text-lg '><small className='bg-gray-300 text-xs p-1 rounded-xl text-gray-600'>{otherDetails[index][1].addressType}</small><br /><span className='font-medium'>Phone: {otherDetails[index][1].phone}</span><br />{otherDetails[index][1].buildingName}, {otherDetails[index][1].street}, {otherDetails[index][1].district}, {otherDetails[index][1].state}, {otherDetails[index][1].pincode}<br />{otherDetails[index][1].landmark && otherDetails[index][1].landmark}</label>
                                                    </div>

                                                </div>

                                            </div>
                                        )}


                                    </div>
                                    <h2 className='text-xl font-bold mb-6'>Ordered Products</h2>
                                    {order.map((products, productIndex) => (
                                        <div key={productIndex} className='flex my-2 border border-gray-300 py-2 items-center justify-between'>
                                            <div className='flex items-center'>
                                                <Link to={`/shoppingApp/products/${products.product._id}`} className='w-[150px] flex justify-center'>
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
                            ))}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default CustomerOrders


