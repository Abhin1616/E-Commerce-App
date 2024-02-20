import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { errorStyle, validStyle } from '../pages/formStyles'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const UserDetails = ({ customer, setRefresh }) => {
    const [edit, setEdit] = useState(false)

    const [showButton, setShowButton] = useState('edit')
    const handleInputChangePhone = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        setValue('phone', value);
    };
    useEffect(() => {
        let nameParts = customer.name.split(' ');
        let firstName = nameParts[0];
        let lastName = nameParts.slice(1).join(' ')
        setValue("firstName", firstName)
        setValue("lastName", lastName)
        setValue("gender", customer.gender)
        setValue("phone", customer.phone)
    }, [])

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const registerOptions = {
        firstName: { required: "First Name is required" },
        lastName: { required: "Last Name is required" },
        gender: {
            required: 'Select a field',
            validate: value => ['male', 'female', 'others'].includes(value) || 'Invalid value'
        },
        phone: {
            required: "Phone Number is required",
            pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid phone number"
            }
        },
    }
    const onsubmit = (inputs) => {
        const { firstName, lastName, gender, phone } = inputs
        const data = { name: firstName + " " + lastName, gender, phone }
        console.log(data)
        axios.patch("http://localhost:3000/shoppingApp/customer/profile", { ...data }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                enqueueSnackbar(res.data.message, {
                    variant: 'success', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setEdit(false)
                setShowButton("edit")
                setRefresh({ rfrsh: (prevValue) => (!prevValue) })
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setRefresh({ rfrsh: (prevValue) => (!prevValue) })
            })
    }

    return (

        <div className="ml-5 rounded-lg col-span-7 bg-white p-6 shadow-md flex flex-col">
            <div className='text-2xl font-semibold mb-3'>
                User Information
                <div className='flex justify-center'>
                    <div className='text-left w-[95%]'>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled={!edit}
                                        type="text"
                                        name="firstName"
                                        id="first-name"
                                        autoComplete="given-name"
                                        {...register("firstName", registerOptions.firstName)}
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`}
                                    />
                                    {errors.firstName &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.firstName?.message}</small>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled={!edit}
                                        type="text"
                                        name="lastName"
                                        id="last-name"
                                        autoComplete="family-name"
                                        {...register("lastName", registerOptions.lastName)}
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.lastName ? errorStyle : validStyle}`}
                                    />
                                    {errors.lastName &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.lastName?.message}</small>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled
                                        value={customer.username}
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6${errors.username ? errorStyle : validStyle}`}
                                    />
                                </div>

                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled
                                        value={customer.email}
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.email ? errorStyle : validStyle}`}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    Gender
                                </label>
                                <div className="mt-2 text-sm">
                                    {edit ? <div>
                                        <input
                                            disabled={!edit}
                                            id="male"
                                            name="gender"
                                            type="radio"
                                            {...register("gender", registerOptions.gender)}
                                            autoComplete="male"
                                            value={"male"}

                                        />
                                        <label className='ml-3' htmlFor="male">Male</label>
                                        <input
                                            disabled={!edit}
                                            id="female"
                                            name="gender"
                                            type="radio"
                                            {...register("gender", registerOptions.gender)}
                                            autoComplete="female"
                                            value={"female"}
                                            className='ml-7'
                                        />
                                        <label className='ml-3' htmlFor="female">Female</label>
                                        <input
                                            disabled={!edit}
                                            id="others"
                                            name="gender"
                                            type="radio"
                                            {...register("gender", registerOptions.gender)}
                                            autoComplete="others"
                                            value={"others"}
                                            className='ml-7'
                                        />
                                        <label className='ml-3' htmlFor="others">Others</label>
                                        {errors.gender &&
                                            <div className="text-red-500 text-base">
                                                <small>{errors.gender?.message}</small>
                                            </div>
                                        }
                                    </div> : <div>
                                        {customer.gender === "male" && <div>
                                            <input
                                                disabled={!edit}
                                                id="male"
                                                name="gender"
                                                type="radio"
                                                {...register("gender", registerOptions.gender)}
                                                autoComplete="male"
                                                value={"male"}

                                            />
                                            <label className='ml-3 text-gray-500' htmlFor="male">Male</label>
                                        </div>}
                                        {customer.gender === "female" && <div>
                                            <input
                                                disabled={!edit}
                                                id="female"
                                                name="gender"
                                                type="radio"
                                                {...register("gender", registerOptions.gender)}
                                                autoComplete="female"
                                                value={"female"}
                                            />
                                            <label className='ml-3 text-gray-500' htmlFor="female">Female</label>
                                        </div>}
                                        {customer.gender === "others" && <div>
                                            <input
                                                disabled={!edit}
                                                id="others"
                                                name="gender"
                                                type="radio"
                                                {...register("gender", registerOptions.gender)}
                                                autoComplete="others"
                                                value={"others"}
                                            />
                                            <label className='ml-3 text-gray-500' htmlFor="others">Others</label>
                                        </div>}

                                    </div>}
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        disabled={!edit}
                                        id="phone"
                                        name="phone"
                                        type="number"
                                        onFocus={handleInputChangePhone}
                                        {...register("phone", registerOptions.phone)}
                                        autoComplete="phone"
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.phone ? errorStyle : validStyle}`}
                                    />

                                    {errors.phone &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.phone?.message}</small>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        {showButton === "edit" ? <button className='rounded-md bg-indigo-600 px-5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-8' onClick={() => {
                            setEdit(true)
                            setShowButton('save')
                        }}>Edit</button> : <button className='rounded-md bg-orange-600 px-5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-8' onClick={handleSubmit(onsubmit)}>Save</button>}
                    </div>
                </div>


            </div>
        </div>
    )
}

export default UserDetails