import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

const SellerViewAddedProducts = () => {
    const [products, setProducts] = useState()
    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get("http://localhost:3000/shoppingApp/seller/home/products", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                setProducts(res.data)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)

            })
    }, [])
    return (
        <div className='flex justify-center'>
            {products ?
                <div className='w-2/3'>
                    <h1 className='text-center text-4xl'>View Products</h1>
                    <div className='mt-10'>
                        <table className={`table-fixed w-full shadow-md rounded-lg overflow-hidden text-left bg-white`}>
                            <thead className="">
                                <tr>
                                    <th className="w-1/2 py-4">Product</th>
                                    <th className="w-1/6 py-4">Price</th>
                                    <th className="w-1/6 py-4">Availability Status</th>
                                    <th className="w-1/6 py-4">Stock</th>

                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className={` border-t border-gray-200 ${product.isAvailable && product.quantity > 0 ? "bg-white" : "bg-stone-200"}`}>
                                        <td className='py-4'><Link className='hover:text-blue-600' to={`/shoppingApp/seller/view-product/${product._id}`}>{product.productName}</Link></td>
                                        <td>Rs. {product.price}</td>
                                        <td className={product.isAvailable ? "text-green-400" : "text-red-400"}>{product.isAvailable ? "Available" : "Not Available"}</td>
                                        <td className={product.quantity > 0 ? "text-green-400" : "text-red-400"}>{product.quantity > 0 ? "In Stock" : "Out of stock"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                </div>

                : <LoadingSpinner />
            }
        </div>
    )
}

export default SellerViewAddedProducts