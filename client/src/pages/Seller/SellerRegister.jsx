import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form';
import { errorStyle, validStyle } from '../formStyles';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useState } from 'react';

const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const SellerRegister = () => {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
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
        email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
            }
        },
        password: {
            required: "Password is required",
            pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
                message: "Your password should be a minimum of 8 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
            }
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
    const navigate = useNavigate();
    const handleInputChangeDistrict = (event) => {
        let value = event.target.value.replace(/[^a-zA-Z]/g, ''); // Remove non-letters
        setValue('district', value);
    };

    const onSubmit = (inputs) => {
        setLoading(true)
        const { firstName, lastName, email, password, gender, username, phone, street,
            district, state, pincode, businessName } = inputs;

        const data = {
            name: `${firstName} ${lastName}`,
            email,
            password,
            username,
            phone: Number(phone),
            businessName,
            gender,
            address: {
                street,
                district,
                state,
                pincode: Number(pincode)
            }
        };

        axios.post("http://localhost:3000/shoppingApp/seller/register", data)
            .then(() => {
                setLoading(false)
                enqueueSnackbar("Registered Successfully", {
                    variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate("/shoppingApp/seller/login");
            })
            .catch((err) => {
                setLoading(false)
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                console.log(err);
                reset()
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {loading ? <div className='flex h-[90vh] items-center justify-center'><LoadingSpinner /></div> : <div className="border-solid border-2 border-b border-gray-300 pb-12 w-2/5 mx-auto p-8 mt-10 rounded-md bg-white my-20 shadow-2xl">
                <h1 className='text-center text-4xl mb-6'>Business Account Registration</h1>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="firstName"
                                id="first-name"
                                autoComplete="given-name"
                                required
                                {...register("firstName", registerOptions.firstName)}
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.firstName ? errorStyle : validStyle}`}
                            />
                            {errors.firstName &&
                                <div className="text-red-500">
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
                                name="lastName"
                                id="last-name"
                                autoComplete="family-name"
                                required
                                {...register("lastName", registerOptions.lastName)}
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.lastName ? errorStyle : validStyle}`}
                            />
                            {errors.lastName &&
                                <div className="text-red-500">
                                    <small>{errors.lastName?.message}</small>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                {...register("email", registerOptions.email)}
                                autoComplete="email"
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.email ? errorStyle : validStyle}`}
                            />
                            {errors.email &&
                                <div className="text-red-500">
                                    <small>{errors.email?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                            Gender
                        </label>
                        <div className="mt-2">
                            <input
                                id="male"
                                name="gender"
                                type="radio"
                                {...register("gender", registerOptions.gender)}
                                autoComplete="male"
                                value={"male"}

                            />
                            <label className='ml-3' htmlFor="male">Male</label>

                            <input
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
                                <div className="text-red-500">
                                    <small>{errors.gender?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
                            Business Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="businessName"
                                name="businessName"
                                type="text"
                                required
                                {...register("businessName", registerOptions.businessName)}
                                autoComplete="businessName"
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.businessName ? errorStyle : validStyle}`}
                            />
                            {errors.businessName &&
                                <div className="text-red-500">
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
                                name="phone"
                                type="number"
                                required
                                {...register("phone", registerOptions.phone)}
                                autoComplete="phone"
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
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="username"
                                required
                                {...register("username", registerOptions.username)}
                                autoComplete="username"
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.username ? errorStyle : validStyle}`}
                            />
                            {errors.username &&
                                <div className="text-red-500">
                                    <small>{errors.username?.message}</small>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                {...register("password", registerOptions.password)}
                                autoComplete="password"
                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.password ? errorStyle : validStyle}`}
                            />
                            {errors.password &&
                                <div className="text-red-500">
                                    <small>{errors.password?.message}</small>
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
                        type="submit"
                        className="w-full rounded-md bg-purple-600 mt-5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    >
                        Register
                    </button>
                </div>
            </div>}

        </form >

    );
};

export default SellerRegister;

