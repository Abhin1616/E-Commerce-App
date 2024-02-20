import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack'
import { Link, useNavigate } from 'react-router-dom';
import EmptyCartTemplate from '../../components/EmptyCartTemplate';
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";


const CustomerCart = () => {
    const [products, setProducts] = useState([]);
    const [cartEmpty, setCartEmpty] = useState(false)
    const [price, setPrice] = useState({ subtotal: 0, discount: 0 });
    const [quantities, setQuantities] = useState({});
    const [cartUpdated, setCartUpdated] = useState(false);
    const removeProduct = (id) => {
        axios.post(`http://localhost:3000/shoppingApp/customer/home/products/cart/${id}/remove`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                enqueueSnackbar("Item removed from cart", {
                    variant: 'success', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setCartUpdated(prevState => !prevState)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const decreaseQty = (id) => {
        axios.post(`http://localhost:3000/shoppingApp/customer/home/products/cart/${id}/decrease`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setCartUpdated(prevState => !prevState)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                console.log(err)
            })
    }
    const increaseQty = (id) => {
        axios.post(`http://localhost:3000/shoppingApp/customer/home/products/cart/${id}/increase`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setCartUpdated(prevState => !prevState)
            })
            .catch(err => {
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                console.log(err)
            })
    }
    const navigate = useNavigate();
    const checkout = () => {
        navigate("/shoppingApp/checkout")
    }
    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/customer/home/products/cart", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (res.data !== "Your cart is empty") {
                    let discountPercentage = 0.05;
                    res.data.products.map(product => {
                        setQuantities(prevQuantities => ({
                            ...prevQuantities,
                            [product._id]: product.quantity,
                        }));
                    });
                    setProducts(res.data.products);
                    console.log(res.data)
                    setPrice(prevState => ({ ...prevState, subtotal: res.data.grandTotal }));
                    setPrice(prevState => ({ ...prevState, discount: Math.floor((res.data.grandTotal * discountPercentage) / 100) * 100 }));
                } else {
                    setCartEmpty(true)
                }
            })
            .catch((err) => {
                let message;
                let loc;
                if (err.response.data.error && err.response.data.error === "Unauthorized") {
                    message = "Please Log in"
                    loc = "/shoppingApp/login"
                } else {
                    message = "Something went wrong"
                    loc = "/shoppingApp/home"
                }
                enqueueSnackbar(message, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate(loc, { state: { from: location.pathname } })
                console.log(err)
            })
    }, [cartUpdated]);

    return (
        <div className={`${!cartEmpty ? "h-full bg-gray-100" : "bg-gray-200"}  min-h-[90vh] pt-10`}>
            <div>
                <h1 className=" mb-10 text-center text-3xl font-bold">Your Cart</h1>
                {!cartEmpty ? <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="rounded-lg md:w-2/3">
                        {products.map((product) => (
                            <div key={product._id} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                <Link to={`/shoppingApp/products/${product.product._id}`}>
                                    <img src={product.product.image[0].url} alt="product-image" className="w-full rounded-lg sm:w-40" />
                                </Link>
                                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                    <div className="mt-5 sm:mt-0">
                                        <h2 className="text-lg font-bold text-gray-900">{product.product.productName}</h2>
                                        <h3 className="text-base font-semibold text-gray-900">Rs. {product.product.price}</h3>
                                        <p className="mt-1 text-xs text-gray-700">Qty {product.quantity}</p>
                                    </div>
                                    <div className="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                        <div className="flex items-center border-gray-100 ml-8">
                                            <span
                                                className={`select-none rounded-l py-1 px-3.5 duration-100 ${product.quantity > 1 ? "cursor-pointer bg-gray-100 hover:bg-blue-500 hover:text-blue-50" : "cursor-default text-gray-400 bg-gray-200"}`}
                                                onClick={() => {
                                                    if (product.quantity <= 1) {
                                                        return;
                                                    }
                                                    decreaseQty(product.product._id);
                                                }}
                                            > - </span>

                                            <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={quantities[product._id] || ''} min="1" readOnly />
                                            <span className=" select-none cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={() => { increaseQty(product.product._id) }}> + </span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <p className="text-sm w-20 text-right">Rs. {product.price}</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500" onClick={() => (removeProduct(product.product._id))}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Sub total */}
                    <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                        <div className="mb-2 flex justify-between">
                            <p className="text-gray-700">Subtotal</p>
                            <p className="text-gray-700 font-medium">Rs. {price.subtotal}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-700 ">Discount</p>
                            <p className="text-gray-700 font-medium text-green-600">-{price.discount}</p>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between">
                            <p className="text-lg font-bold">Total</p>
                            <div className="">
                                <p className=" text-lg font-bold">₹ {price.subtotal - price.discount} INR</p>
                            </div>

                        </div>
                        <small className=" text-sm text-gray-500"><ExclamationCircleIcon className="h-4 w-4 text-gray-500 inline" />excluding delivery charges</small>
                        <button onClick={checkout} className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Check out</button>
                    </div>
                </div> : <EmptyCartTemplate />}
            </div>
        </div>
    );
};

export default CustomerCart;


