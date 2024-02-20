import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from "../../components/LoadingSpinner.jsx"
import { useNavigate, useParams } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { errorStyle, validStyle } from '../formStyles.js'
const SellerEditProduct = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const registerOptions = {
        productName: {
            required: "Product name is required",
            minLength: {
                value: 3, message: "Product name should contain minimum 3 letters"
            }
        },
        description: {
            required: "Description is required",
            minLength: {
                value: 3, message: "Description should contain minimum 3 letters"
            }
        },
        category: {
            required: "Category is required",
            minLength: {
                value: 3, message: "Category should contain minimum 3 letters"
            }
        },
        quantity: {
            required: "Quantity is required",
            min: {
                value: 1, message: "Minimum quantity : 1"
            }

        },
        price: {
            required: "Price is required",
            min: {
                value: 1, message: "Price cannot be lesser than 1"
            }
        },
        image: []
    }
    const { productId } = useParams()

    const onSubmit = (formData) => {
        const data = new FormData()
        setLoading(true)
        try {
            for (let key in formData) {
                if (key !== "image") {
                    data.append(key, formData[key])
                }
            }
            if (formData.image.length) {
                for (let i = 0; i < formData.image.length; i++) {
                    data.append('image', formData.image[i]);
                }
            }

            const token = localStorage.getItem("token");

            axios.patch(`http://localhost:3000/shoppingApp/seller/home/products/${productId}`, data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // send the token in the header
                }
            })
                .then((res) => {
                    enqueueSnackbar("Product Edited Sucessfully!", {
                        variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center'
                        }
                    })
                    console.log(res)
                    setLoading(false)
                    navigate(`/shoppingApp/seller/view-product/${productId}`)
                })
                .catch((err) => {
                    setLoading(false)
                    console.log(err)
                    if (err.response.data.error === "Unauthorized") {
                        enqueueSnackbar("Something went wrong! Log in again!", {
                            variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'center'
                            }
                        })
                    } else {
                        enqueueSnackbar(err.reponse.data.error, {
                            variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'center'
                            }
                        })
                        console.log(err)
                    }
                })

        } catch (err) {
            setLoading(false)
            console.log(err)
        }
    }
    useEffect(() => {
        setLoading(true)
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:3000/shoppingApp/seller/home/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                reset({
                    productName: res.data.productName,
                    description: res.data.description,
                    category: res.data.category,
                    quantity: res.data.quantity,
                    price: res.data.price,
                    image: []
                });
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)} >
            {loading ? (<LoadingSpinner />) : (<div className='border-solid border-2 border-b border-gray-900/10 pb-12 w-2/5 mx-auto p-8 mt-10 rounded-md bg-gray-100 mb-20'>
                <h1 className='text-center text-3xl font-semibold mb-7'>Edit Product</h1>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className='sm:col-span-6'>
                        <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-900'>Product Name</label>
                        <div className='mt-2'>
                            <input className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`} id='name' type="text" name='productName' {...register("productName", registerOptions.productName)} />
                            {errors.productName &&
                                <div className="text-red-500">
                                    <small>{errors.productName?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='sm:col-span-3'>
                        <label htmlFor="price" className='block text-sm font-medium leading-6 text-gray-900'>Price</label>
                        <div className='mt-2'>
                            <input className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`} id='price' type="number" name='price' {...register("price", registerOptions.price)} />
                            {errors.price &&
                                <div className="text-red-500">
                                    <small>{errors.price?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='sm:col-span-3'>
                        <label htmlFor="quantity" className='block text-sm font-medium leading-6 text-gray-900'>Quantity</label>
                        <div className='mt-2'>
                            <input className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`} id='quantity' type="number" name='quantity' {...register("quantity", registerOptions.quantity)} />
                            {errors.quantity &&
                                <div className="text-red-500">
                                    <small>{errors.quantity?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='sm:col-span-6'>
                        <label htmlFor="category" className='block text-sm font-medium leading-6 text-gray-900'>Category</label>
                        <div className='mt-2'>
                            <input className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`} id='category' type="text" name='category' {...register("category", registerOptions.category)} />
                            {errors.category &&
                                <div className="text-red-500">
                                    <small>{errors.category?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='sm:col-span-6'>
                        <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-900'>Product Image</label>
                        <div className='mt-2'>
                            <input accept=".jpg, .jpeg, .png" type="file" id='image' name="image" multiple {...register("image", registerOptions.image)} className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary" />
                        </div>
                    </div>
                    <div className='sm:col-span-6'>
                        <label htmlFor="description" className='block text-sm font-medium leading-6 text-gray-900'>Description</label>
                        <div className='mt-2'>
                            <textarea style={{ minHeight: "60px", maxHeight: '120px' }} className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`} id='description' type="text" name='description' {...register("description", registerOptions.description)} />
                            {errors.description &&
                                <div className="text-red-500">
                                    <small>{errors.description?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                </div>


                <button
                    type="submit"
                    className="mt-10 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Edit
                </button>
            </div>)}


        </form>


    )
}

export default SellerEditProduct


