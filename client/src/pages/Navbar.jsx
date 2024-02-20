import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import SearchBar from '../components/SearchBar';
import Categorize from '../components/Categorize';

const Navbar = ({ setSearchTerm, setCategory, setSelectedCategory, selectedCategory }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);


    // Check token expiry every minute
    useEffect(() => {
        const checkTokenExpiry = () => {
            const token = localStorage.getItem('token');
            const expiryTime = localStorage.getItem('expiryTime');
            if (token && expiryTime && Date.now() >= expiryTime * 1000) {
                // Token has expired, redirect to login page
                enqueueSnackbar("Token is expired. Please Log in", {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                });
                logout()
                navigate('/shoppingApp/login');
            }
        };

        const intervalId = setInterval(checkTokenExpiry, 60000); // Check every minute
        checkTokenExpiry(); // Check immediately when the component mounts

        return () => clearInterval(intervalId); // Clear the interval when the component unmounts
    }, []);


    const isTokenExpired = () => {
        const expiryTime = localStorage.getItem('expiryTime');
        return Date.now() >= expiryTime * 1000;
    };

    const verifyToken = () => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired()) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('expiryTime');
        }
    };

    const checkAuthStatus = () => {
        if (localStorage.getItem("userType") === "seller") {
            verifyToken();
        } else if (localStorage.getItem("userType") === "customer") {
            verifyToken();
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [location.pathname]);

    const refreshCustomerHome = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        navigate("/shoppingApp/home", { replace: true, state: { key: Date.now() } });
    };

    const refreshSellerHome = () => {
        navigate("/shoppingApp/seller/home", { replace: true, state: { key: Date.now() } });
    };

    const logout = () => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/shoppingApp/logout", { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                delete axios.defaults.headers.common['Authorization'];
                enqueueSnackbar("Logged Out Successfully", {
                    variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                });
                setIsAuthenticated(false);
                navigate("/shoppingApp/login");
            })
            .catch((err) => {
                console.log(err);
                enqueueSnackbar(err.response.data.message, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                });
            });
    };

    return (
        <div className='bg-gray-800 py-3 text-white flex justify-between items-center h-[64px]'>
            <span onClick={localStorage.getItem("userType") === "seller" ? refreshSellerHome : refreshCustomerHome} className='text-2xl ml-3 cursor-pointer'>E-Commerce</span>
            <div className='flex justify-between items-center space-x-10 mr-3'>
                {location.pathname === "/shoppingApp/home" && <SearchBar setSearchTerm={setSearchTerm} />}
                {location.pathname === "/shoppingApp/home" && <Categorize setCategory={setCategory} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />}

                {isAuthenticated && !location.pathname.includes('/seller') && <ShoppingCartIcon onClick={() => navigate("/shoppingApp/cart")} className="h-6 w-6 text-gray-400 hover:text-white" />}
                {isAuthenticated && <button onClick={() => { localStorage.getItem("userType") === "seller" ? navigate("/shoppingApp/seller/profile") : navigate("/shoppingApp/profile") }} className='text-white-200 hover:text-shadow-white'>Profile</button>}

                {!isAuthenticated && <button className='text-white-200 hover:text-shadow-white' onClick={() => navigate("/shoppingApp/login")}>Login</button>}
                {isAuthenticated && <button className='text-white-200 hover:text-shadow-white' onClick={logout}>Logout</button>}
            </div>
        </div>
    );
};

export default Navbar;
