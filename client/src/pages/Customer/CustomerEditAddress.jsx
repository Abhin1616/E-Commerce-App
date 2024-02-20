import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { validStyle, errorStyle } from '../formStyles';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
const CustomerEditAddress = () => {
    let location = useLocation()
    console.log(location)
    const navigate = useNavigate()
    const { addressId } = useParams()
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
    const addressType = watch("addressType")
    const registerOptions = {
        addressType: {
            required: "Select one",
            validate: value => value === "home" || value === "work" || "Invalid address type"
        },
        buildingName: {
            required: "This field is required",
            validate: value => {
                const letterMatch = value.match(/[a-zA-Z]/g);
                return (letterMatch && letterMatch.length >= 5) || "Enter a vaild address";
            }
        },
        phone: {
            required: "Phone Number is required",
            pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid phone number"
            }
        },
        street: {
            required: "Street name is required",
            validate: value => {
                const letterMatch = value.match(/[a-zA-Z]/g);
                return (letterMatch && letterMatch.length >= 5) || "Enter a vaild address";
            }
        },
        district: { required: "District name is required" },
        state: {
            required: "Select a state",
            validate: value => states.includes(value) || "Invalid state"
        },
        landmark: {

        },
        pincode: {
            required: "Pincode is required",
            pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: "Invalid pincode"
            }
        }

    }

    const handleInputChangePhone = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        setValue('phone', value);
    };
    const handleInputChangeDistrict = (event) => {
        let value = event.target.value.replace(/[^a-zA-Z]/g, ''); // Remove non-letters
        setValue('district', value);
    };

    const onSubmit = (data) => {

        axios.patch(`http://localhost:3000/shoppingApp/customer/profile/address/${addressId}`, { ...data }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                console.log(res)
                enqueueSnackbar(res.data, {
                    variant: 'success', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })

                navigate(location.state.from, { state: { selectedOpt: "Address" } })
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar("Something went wrong", {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
            })

    }
    useEffect(() => {


        axios.get(`http://localhost:3000/shoppingApp/customer/profile/address/${addressId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                setValue('addressType', res.data.addressType);
                setValue('phone', res.data.phone);
                setValue('buildingName', res.data.buildingName);
                setValue('district', res.data.district);
                setValue('landmark', res.data.landmark);
                setValue('pincode', res.data.pincode);
                setValue('state', res.data.state);
                setValue('street', res.data.street);
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])
    return (
        <div className="border-solid border-2 border-b border-gray-300 pb-12 w-2/5 mx-auto p-8 mt-10 rounded-md bg-white my-20 shadow-2xl pt-10">
            <h1 className=" mb-10 text-center text-3xl font-bold">Edit Address</h1>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                        Address Type
                    </label>
                    <div className="mt-2">

                        <input type="radio" name='addressType' value={'home'} id='home' {...register('addressType', registerOptions.addressType)} defaultChecked />
                        <label className='ml-3' htmlFor="home">Home</label>
                        <input className='ml-10' type="radio" name='addressType' value={'work'} id='work' {...register('addressType', registerOptions.addressType)} />
                        <label className='ml-3' htmlFor="work">Work</label>


                        {errors.addressType &&
                            <div className="text-red-500">
                                <small>{errors.addressType?.message}</small>
                            </div>
                        }
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                        Phone Number
                    </label>
                    <div className="mt-2">
                        <input
                            id="phone"
                            onInput={handleInputChangePhone}
                            name="phone"
                            type="text" // Change this to text
                            required
                            {...register("phone", registerOptions.phone)}
                            autoComplete="phone"
                            maxLength="10"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.phone ? errorStyle : validStyle}`}
                        />

                        {errors.phone &&
                            <div className="text-red-500">
                                <small>{errors.phone?.message}</small>
                            </div>
                        }
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="buildingName" className="block text-sm font-medium leading-6 text-gray-900">
                        {addressType === "home" ? "House Name" : "Office Name"}
                    </label>
                    <div className="mt-2">
                        <input
                            id="buildingName"
                            name="buildingName"
                            type="text" // Change this to text
                            required
                            {...register("buildingName", registerOptions.buildingName)}
                            autoComplete="buildingName"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.buildingName ? errorStyle : validStyle}`}
                        />

                        {errors.buildingName &&
                            <div className="text-red-500">
                                <small>{errors.buildingName?.message}</small>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                        Street address
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="street"
                            id="street-address"
                            required
                            {...register("street", registerOptions.street)}
                            autoComplete="street-address"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.street ? errorStyle : validStyle}`}
                        />
                        {errors.street &&
                            <div className="text-red-500">
                                <small>{errors.street?.message}</small>
                            </div>
                        }
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                        State
                    </label>
                    <div className="mt-2">
                        <select
                            id="state"
                            name="state"
                            autoComplete="state-name"
                            required
                            defaultValue=""
                            {...register("state", registerOptions.state)}
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.state ? errorStyle : validStyle}`}
                        >
                            <option value="" disabled>--- select one ---</option>
                            {states.map((state, index) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        {errors.state &&
                            <div className="text-red-500">
                                <small>{errors.state?.message}</small>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="landmark" className="block text-sm font-medium leading-6 text-gray-900">
                        Landmark
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="landmark"
                            id="landmark"
                            required
                            {...register("landmark", registerOptions.landmark)}
                            autoComplete="landmark"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.landmark ? errorStyle : validStyle}`}
                        />
                        {errors.landmark &&
                            <div className="text-red-500">
                                <small>{errors.landmark?.message}</small>
                            </div>
                        }
                    </div>
                </div>


                <div className="sm:col-span-3 sm:col-start-1">
                    <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
                        District
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="district"
                            onInput={handleInputChangeDistrict}
                            required
                            {...register("district", registerOptions.district)}
                            id="district"
                            autoComplete="address-level2"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.district ? errorStyle : validStyle}`}
                        />
                        {errors.district &&
                            <div className="text-red-500">
                                <small>{errors.district?.message}</small>
                            </div>
                        }
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                        ZIP / Postal code
                    </label>
                    <div className="mt-2">
                        <input
                            type="number"
                            name="pincode"
                            required
                            {...register("pincode", registerOptions.pincode)}
                            id="postal-code"
                            autoComplete="postal-code"
                            className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.pincode ? errorStyle : validStyle}`}
                        />
                        {errors.pincode &&
                            <div className="text-red-500">
                                <small>{errors.pincode?.message}</small>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center gap-x-6">
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="w-full rounded-md bg-purple-600 mt-5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                >
                    Edit
                </button>
            </div>
        </div>
    )
}

export default CustomerEditAddress