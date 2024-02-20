import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form';
import { errorStyle, validStyle } from '../formStyles';
const CustomerRegister = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const registerOptions = {
        firstName: { required: "First Name is required" },
        lastName: { required: "Last Name is required" },
        gender: {
            required: 'Select a field',
            validate: value => ['male', 'female', 'others'].includes(value) || 'Invalid value'
        },
        username: {
            required: "Username is required",
            minLength: { value: 3, message: "Username should have minimum 3 letters" },
            maxLength: { value: 30, message: "Username should not exceed 30 letters" }
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
    }
    const navigate = useNavigate();
    const backToLogin = () => {
        // Use navigate function to navigate to the login page
        navigate("/shoppingApp/login");
    };
    const numberInputOnWheelPreventChange = (e) => {
        e.target.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });
        e.target.addEventListener('blur', (event) => {
            event.target.removeEventListener('wheel', (event) => event.preventDefault(), { passive: false });
        }, { once: true });
    }

    const onSubmit = (inputs) => {
        const { firstName, lastName, email, gender, password, username, phone } = inputs;
        const data = { name: `${firstName} ${lastName}`, email, password, gender, username, phone: Number(phone) };
        axios.post("http://localhost:3000/shoppingApp/customer/register", data)
            .then((res) => {
                console.log(res)
                enqueueSnackbar('Registered Successfully', {
                    variant: 'success', autoHideDuration: 2000, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate("/shoppingApp/login");
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar(err.request.response, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="border-solid border-2 border-b border-gray-900/10 pb-12 w-2/5 mx-auto p-8 mt-10 rounded-md bg-gray-100 mb-20">
                <h1 className='text-center text-4xl'>Create Account</h1>
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
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone Number
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                name="phone"
                                type="number"
                                onFocus={numberInputOnWheelPreventChange}
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
                        <div className='text-xs mt-3'>Trying to become a seller? <br /><Link to="/shoppingApp/seller/register"><b>Register Here!</b></Link></div>
                    </div>

                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        onClick={backToLogin}
                        className="rounded-md text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 px-3 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Register
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CustomerRegister;
