import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { errorStyle, validStyle } from '../formStyles'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]
const SellerEditProfile = ({ seller, setRefresh }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const [edit, setEdit] = useState(false)
    const [showButton, setShowButton] = useState('edit')
    const registerOptions = {
        firstName: { required: "First Name is required" },
        lastName: { required: "Last Name is required" },
        username: {
            required: "Username is required",
            minLength: { value: 3, message: "Username should have minimum 3 letters" },
            maxLength: { value: 30, message: "Username should not exceed 30 letters" }
        },
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
        businessName: {
            required: "Business Name is required",
            minLength: { value: 3, message: "Business name should contain minimum 3 letters" }
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
        pincode: {
            required: "Pincode is required",
            pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: "Invalid pincode"
            }
        }

    }
    useEffect(() => {
        let nameParts = seller.name.split(' ');
        let firstName = nameParts[0];
        let lastName = nameParts.slice(1).join(' ')
        setValue("firstName", firstName)
        setValue("lastName", lastName)
        setValue("gender", seller.gender)
        setValue("phone", seller.phone)
        setValue("businessName", seller.businessName)
        setValue("street", seller.address.street)
        setValue("state", seller.address.state)
        setValue("district", seller.address.district)
        setValue("pincode", seller.address.pincode)
    }, [])
    const handleInputChangeDistrict = (event) => {
        let value = event.target.value.replace(/[^a-zA-Z]/g, ''); // Remove non-letters
        setValue('district', value);
    };
    const onsubmit = (inputs) => {
        const { firstName, lastName, gender, phone, businessName, street, district, state, pincode } = inputs
        const data = {
            name: firstName + " " + lastName, gender, phone, businessName,
            address: {
                street, district, state, pincode
            }
        }
        console.log(data)
        axios.patch("http://localhost:3000/shoppingApp/seller/profile", { ...data }, {
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
                setRefresh((prevValue) => (!prevValue))
            })
            .catch((err) => {
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setRefresh((prevValue) => (!prevValue))
            })
    }
    return (
        <div className="ml-5 rounded-lg col-span-7 bg-white p-6 shadow-md flex flex-col">
            <div className='text-2xl font-semibold mb-3'>
                <div className='flex justify-center'>
                    <div className='text-left w-[95%]'>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        disabled={!edit}
                                        name="firstName"
                                        id="first-name"
                                        autoComplete="given-name"
                                        required
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
                                        type="text"
                                        disabled={!edit}
                                        name="lastName"
                                        id="last-name"
                                        autoComplete="family-name"
                                        required
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
                                        value={seller.username}
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
                                        value={seller.email}
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
                                        {seller.gender === "male" && <div>
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

                                        {seller.gender === "female" && <div>
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
                                        {seller.gender === "others" && <div>
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
                            <div className="sm:col-span-6">
                                <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Business Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="businessName"
                                        disabled={!edit}
                                        name="businessName"
                                        type="text"
                                        required
                                        {...register("businessName", registerOptions.businessName)}
                                        autoComplete="businessName"
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.businessName ? errorStyle : validStyle}`}
                                    />
                                    {errors.businessName &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.businessName?.message}</small>
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
                                        disabled={!edit}
                                        name="phone"
                                        type="number"
                                        required
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


                            <div className="sm:col-span-3">
                                <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                                    State
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="state"
                                        name="state"
                                        disabled={!edit}
                                        autoComplete="state-name"
                                        required
                                        defaultValue=""
                                        {...register("state", registerOptions.state)}
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.state ? errorStyle : validStyle}`}
                                    >
                                        <option value="" disabled>--- select one ---</option>
                                        {states.map((state, index) => (
                                            <option key={index} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.state &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.state?.message}</small>
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
                                        disabled={!edit}
                                        id="street-address"
                                        required
                                        {...register("street", registerOptions.street)}
                                        autoComplete="street-address"
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.street ? errorStyle : validStyle}`}
                                    />
                                    {errors.street &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.street?.message}</small>
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
                                        disabled={!edit}
                                        onInput={handleInputChangeDistrict}
                                        required
                                        {...register("district", registerOptions.district)}
                                        id="district"
                                        autoComplete="address-level2"
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.district ? errorStyle : validStyle}`}
                                    />
                                    {errors.district &&
                                        <div className="text-red-500 text-base">
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
                                        disabled={!edit}
                                        required
                                        {...register("pincode", registerOptions.pincode)}
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        className={`pl-2 block w-full rounded-md border-0 py-1.5 ${edit ? "text-gray-900" : "text-gray-500"} shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.pincode ? errorStyle : validStyle}`}
                                    />
                                    {errors.pincode &&
                                        <div className="text-red-500 text-base">
                                            <small>{errors.pincode?.message}</small>
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

export default SellerEditProfile