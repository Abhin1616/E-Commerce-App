import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { Link } from 'react-router-dom'
import emptyCartImg from './emptyCart.png'
import { enqueueSnackbar } from 'notistack'

export default function CartSlidebar({ setShowcartSidebar, changeBtn }) {
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [price, setPrice] = useState(0)
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
    const handleClose = () => {
        // Assuming the transition duration is 500ms
        setTimeout(() => {
            setShowcartSidebar(false);
            changeBtn(false)
        }, 400);
    };

    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/customer/home/products/cart", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                console.log(res)
                if (res.data !== "Your cart is empty") {
                    setProducts(res.data.products)
                    setPrice(res.data.grandTotal)
                    setOpen(true)
                } else {
                    setProducts([]);
                }

            })
            .catch((err) => (console.log(err)))
    }, [cartUpdated])
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                setOpen(false);
                handleClose();
            }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"

                >
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Items</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => {
                                                            setOpen(false)
                                                            handleClose()
                                                        }}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            {products.length > 0 ? <div className="mt-8">
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {products.map((product) => (
                                                            <li key={product.product._id} className="flex py-6">
                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <img
                                                                        src={product.product.image[0].url}
                                                                        className="h-full w-full object-contain"
                                                                    />

                                                                </div>

                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>
                                                                                <Link to={`/shoppingApp/products/${product.product._id}`}>{product.product.productName}</Link>
                                                                            </h3>
                                                                            <p className="ml-4">Rs.{product.product.price}</p>
                                                                        </div>

                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                        <p className="text-gray-500">Qty {product.quantity}</p>

                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                                onClick={() => (removeProduct(product.product._id))}
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div> : <div className='flex flex-col justify-center items-center text-center h-[89vh]'>
                                                <img className='w-[150px] h-auto' src={emptyCartImg} alt="" />
                                                <h3 className='ml-5 text-xl' >Nothing to see here</h3>
                                            </div>}
                                        </div>

                                        {products.length > 0 && <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Total</p>
                                                <p>Rs. {price}</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated in the next step.</p>
                                            <div className="mt-6">
                                                <Link to={"/shoppingApp/cart"} onClick={() => {
                                                    setOpen(false)
                                                    handleClose()
                                                }} className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Go to Cart</Link>

                                            </div>
                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <p>
                                                    or{' '}
                                                    <button
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        onClick={() => {
                                                            setOpen(false)
                                                            handleClose()
                                                        }}
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}
