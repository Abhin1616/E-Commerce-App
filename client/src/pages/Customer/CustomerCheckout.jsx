import React, { useEffect, useState } from 'react'
import CardPayment from '../../components/CardPayment'
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import SuccessGif from '../../components/SuccessGif';
import LoadingSpinner from '../../components/LoadingSpinner';

const CustomerCheckout = () => {
    const location = useLocation();
    let productId;
    if (location.state?.productId) {
        productId = location.state?.productId;
    }
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [price, setPrice] = useState({ subtotal: 0, discount: 0, delivery: 40, cod: 0 });
    const [user, setUser] = useState({ name: "", email: "", phone: "" });
    const [address, setAddress] = useState([])
    const [selectedAddress, setSelectedAddress] = useState()
    const [paymentMethod, setSpaymentMethod] = useState()
    const [product, setProduct] = useState()
    const [orderedSuccessfully, setOrderedSuccessfully] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleRadioChange = (method) => {
        setSpaymentMethod(method)
        if (method === "cod") {
            setPrice(prevState => ({ ...prevState, cod: 10 }));
        } else {
            setPrice(prevState => ({ ...prevState, cod: 0 }));
        }
    }
    const orderProduct = () => {
        setLoading(true)
        const payedPrice = price.subtotal - price.discount + price.delivery + price.cod;
        const address = selectedAddress;
        if (product) {
            axios.post("http://localhost:3000/shoppingApp/customer/home/products/order", { payedPrice, paymentMethod, address, productId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    setOrderedSuccessfully(true)
                    setLoading(false)

                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                })
        } else {
            axios.post("http://localhost:3000/shoppingApp/customer/home/products/order", { payedPrice, paymentMethod, address }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    setOrderedSuccessfully(true)
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                })
        }
    }
    useEffect(() => {
        if (productId) {
            axios.post("http://localhost:3000/shoppingApp/customer/home/checkout", { productId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    console.log(res)
                    let discountPercentage = 0.05;
                    setPrice(prevState => ({ ...prevState, subtotal: res.data.grandTotal }));
                    setPrice(prevState => ({ ...prevState, discount: Math.floor((res.data.grandTotal * discountPercentage) / 100) * 100 }));
                    setUser({ name: res.data.userDetails.name, email: res.data.userDetails.email, phone: res.data.userDetails.phone })
                    setAddress(res.data.userDetails.address)
                    setSelectedAddress(res.data.userDetails.address[0]);
                    setProduct(res.data.product)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            axios.post("http://localhost:3000/shoppingApp/customer/home/checkout", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    console.log(res)
                    if (res.data !== "Your cart is empty") {
                        let discountPercentage = 0.05;
                        console.log(res.data)
                        setPrice(prevState => ({ ...prevState, subtotal: res.data.grandTotal }));
                        setPrice(prevState => ({ ...prevState, discount: Math.floor((res.data.grandTotal * discountPercentage) / 100) * 100 }));
                        setUser({ name: res.data.userDetails.name, email: res.data.userDetails.email, phone: res.data.userDetails.phone })
                        setAddress(res.data.userDetails.address)
                        setSelectedAddress(res.data.userDetails.address[0]);
                    } else {
                        navigate("/shoppingApp/home")
                    }
                })
                .catch((err) => {
                    let message;
                    let loc;

                    if (err.response.data.error && err.response.data.error === "Unauthorized") {
                        message = "Please Log in"
                        loc = "/shoppingApp/login"
                    } else if (err.response.data.error && err.response.data.error.includes("Uh-oh!")) {
                        message = err.response.data.error
                        loc = "/shoppingApp/cart"
                    } else if (err.response.data.error && err.response.data.error === "Add your Address") {
                        message = err.response.data.error
                        loc = "/shoppingApp/profile/add-address"
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
                    console.log(err.response.data)
                })
        }


    }, []);


    return (
        <div>
            {orderedSuccessfully ? <SuccessGif /> : <div>
                {!loading ? <div>{user.name && <div className="h-full bg-gray-100 pt-10">
                    <h1 className=" mb-10 text-center text-3xl font-semibold">Checkout</h1>
                    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                        <div className="rounded-lg md:w-2/3">
                            <div className="rounded-lg bg-white p-6 shadow-md flex flex-col">
                                <div className='text-2xl font-bold mb-3'>
                                    User Information
                                </div>
                                <div className='text-lg font-semibold'>
                                    Name: {user.name}
                                </div>
                                <div className='text-lg font-semibold'>
                                    Email: {user.email}
                                </div>
                                <div className='text-lg font-semibold mb-3'>
                                    Phone: {user.phone}
                                </div>

                                {product && <div className='my-3'>
                                    <div className='text-2xl font-bold mb-3'>
                                        Product Details
                                    </div>
                                    <div className='flex my-4 border border-black py-2 items-center'>
                                        <Link to={`/shoppingApp/products/${product._id}`}>
                                            <img style={{ height: "100px", width: "" }} src={product.image[0].url} alt="" />
                                        </Link>
                                        <div>

                                            <div>
                                                Product Name: <span className='text-base font-semibold'>{product.productName}</span>
                                            </div>
                                            <div>
                                                Price: <span className='text-base font-semibold'>{product.price}</span>
                                            </div>
                                            <div>
                                                Quantity: <span className='text-base font-semibold'>1</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                <div className='text-2xl font-bold mb-3'>
                                    Address Details
                                </div>
                                {address.map((adrs, idx) => (
                                    <div key={idx} className='flex items-start border border-gray-600 mb-2 px-2' >
                                        <input className='mt-2' type="radio" id={idx} name="address" value={adrs} checked={adrs === selectedAddress} onChange={(e) => {
                                            setSelectedAddress(adrs)
                                        }} />
                                        <div className=' ml-3 mb-4'>
                                            <label className='text-lg' value={adrs} htmlFor={idx}><small className='bg-gray-300 text-xs p-1 rounded-xl text-gray-600'>{adrs.addressType}</small><br /><span className='font-medium'>Phone: {adrs.phone}</span><br />{adrs.buildingName}, {adrs.street}, {adrs.district}, {adrs.state}, {adrs.pincode}<br />{adrs.landmark && adrs.landmark}</label>
                                        </div>

                                    </div>
                                ))}

                                <div className='text-2xl font-bold mb-3'>
                                    Payment Methods
                                </div>
                                <div className='mb-2'>
                                    <input type="radio" id="upi" name="paymentMethod" onChange={(e) => { handleRadioChange(e.target.value) }} value="upi" />
                                    <label className='text-lg ml-2' htmlFor="upi">UPI Payment</label>
                                </div>
                                {paymentMethod === "upi" && <form onSubmit={handleSubmit(orderProduct)} className='mb-5'>
                                    <label htmlFor="upiField" className='block text-sm font-medium leading-6 text-gray-900'>Enter your UPI</label>
                                    <input className='block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' id='upiField' {...register('upi', {
                                        required: 'UPI is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/,
                                            message: 'Invalid UPI'
                                        }

                                    })}
                                    />
                                    {errors.upi && <small className='text-red-600'>{errors.upi.message}</small>}
                                    <button type='submit' className='mt-5 w-full rounded-full bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600'>Pay Now</button>
                                </form>}
                                <div className='mb-2'>
                                    <input type="radio" id="card" name="paymentMethod" onChange={(e) => { handleRadioChange(e.target.value) }} value="card" />
                                    <label className='text-lg ml-2' htmlFor="card">Card Payment</label>
                                </div>
                                {paymentMethod == "card" &&
                                    <div className='justify-center mb-5 sm:flex sm:justify-center'>
                                        <CardPayment orderProduct={orderProduct} />
                                    </div>
                                }
                                <div className='mb-2'>
                                    <input type="radio" id="cod" name="paymentMethod" onChange={(e) => { handleRadioChange(e.target.value) }} value="cod" />
                                    <label className='text-lg ml-2' htmlFor="cod">Cash on Delivery</label>
                                </div>
                                {paymentMethod === "cod" && <div>
                                    <div className="flex items-center">
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                        <span className='text-red-600'>An additional ₹ 10 will be added to the order</span>
                                    </div>
                                    <button className='mt-5 w-full rounded-full bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600' onClick={orderProduct}>Place Order</button>
                                </div>}

                            </div>
                        </div>
                        <div className="md:mt-0 md:w-1/3">
                            <div className=' h-half rounded-lg border bg-white p-6 shadow-md'>
                                <div className='flex justify-center font-bold text-xl mb-3'>Order Summary</div>

                                <div className="mb-2 flex justify-between">
                                    <p className="text-gray-700">Subtotal</p>
                                    <p className="text-gray-700 font-medium">{price.subtotal}</p>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <p className="text-gray-700 ">Discount</p>
                                    <p className="text-gray-700 font-medium text-green-600">-{price.discount}</p>
                                </div>
                                <div className="flex mb-2 justify-between">
                                    <p className="text-gray-700 ">Delivery</p>
                                    <p className={`text-gray-700 font-medium ${price.delivery !== 0 && "text-red-600"}`}>{price.delivery === 0 ? "FREE" : ("+" + price.delivery)}</p>
                                </div>
                                {price.cod !== 0 && <div className="flex justify-between">
                                    <p className="text-gray-700 ">COD Charges</p>
                                    <p className="text-gray-700 font-medium text-red-600">+{price.cod}</p>
                                </div>}
                                <hr className="my-4" />
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold">Total</p>
                                    <div className="">
                                        <p className="mb-1 text-lg font-bold">₹ {price.subtotal - price.discount + price.delivery + price.cod} INR</p>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <div className='flex justify-center font-semibold mx-3 underline decoration-double underline-offset-4 mb-10'>Total Savings: <span className='text-green-700 ml-2 '>₹{price.discount - price.delivery - price.cod} </span></div>
                            </div>
                            <div className='mt-6 h-half rounded-lg border bg-white p-6 shadow-md'>
                                <div className='flex justify-center font-bold text-xl mb-3'>Return Policy</div>

                                <div className="mb-2 flex justify-between text-sm">
                                    <p className="text-black">1. </p>
                                    <p className="text-gray-700 ml-2">We accept returns within 30 days of the purchase date. Items returned after 30 days will not be accepted.</p>
                                </div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <p className="text-black">2. </p>
                                    <p className="text-gray-700 ml-2">Items must be returned in their original condition and packaging. Items that are damaged, missing parts, not in the original condition, or have obvious signs of use for reasons not due to an error on our part will not be accepted.</p>
                                </div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <p className="text-black">3. </p>
                                    <p className="text-gray-700 ml-2">The customer is responsible for the return shipping costs unless the return is due to a mistake on our part (you received an incorrect or defective item, etc.).</p>
                                </div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <p className="text-black">4. </p>
                                    <p className="text-gray-700 ml-2">Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If your return is approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}</div> : <LoadingSpinner />}
            </div >}
        </div>
    )
}

export default CustomerCheckout