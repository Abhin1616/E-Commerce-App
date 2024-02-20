import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form';
import { errorStyle, validStyle } from '../formStyles';
const SellerLogin = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const registerOptions = {
        identifier: { required: "Email or Username is required" },
        password: { required: "Password is required" }
    }
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCreds((oldCreds) => {
            return { ...oldCreds, [e.target.name]: e.target.value };
        });
    };

    const onSubmit = (data) => {
        axios.post("http://localhost:3000/shoppingApp/seller/login", data, { withCredentials: true })
            .then((res) => {
                const token = res.data.token
                localStorage.setItem("token", token)
                const decodedToken = jwtDecode(token);
                localStorage.setItem('expiryTime', decodedToken.exp);
                localStorage.setItem('userType', "seller");
                enqueueSnackbar("Log in successful!", {
                    variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate("/shoppingApp/seller/home", { replace: true })
            })
            .catch((err) => {
                enqueueSnackbar(err.request.response, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                reset()
            });
    };
    const backToLogin = () => {
        navigate("/shoppingApp/login")
    }
    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-solid border-2 border-b border-gray-900/10 pb-12 w-2/5 mx-auto p-8 mt-10 rounded-md bg-gray-100">
                <h1 className='text-center text-4xl'>Business Login</h1>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-6">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Email or Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="identifier"
                                name="identifier"
                                type="username"
                                {...register("identifier", registerOptions.identifier)}
                                autoComplete="username"

                                className={`pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${errors.identifier ? errorStyle : validStyle}`}
                            />
                            {errors.identifier &&
                                <div className="text-red-500">
                                    <small>{errors.identifier?.message}</small>
                                </div>
                            }
                        </div>

                    </div>

                    <div className="sm:col-span-6 mb-2">
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
                        </div>
                        <div className="text-red-500">
                            <small>{errors.password?.message}</small>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button onClick={backToLogin} type="button" className="rounded-md text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 px-3 py-2">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Login
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SellerLogin