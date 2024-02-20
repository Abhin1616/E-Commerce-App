
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from "../../components/LoadingSpinner.jsx"
import { enqueueSnackbar } from 'notistack'
const SellerIsAuthenticated = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/shoppingApp/seller/verify-token', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => setIsAuthenticated(true))
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) {
        return <LoadingSpinner />; // or a loading spinner
    }

    if (!isAuthenticated) {
        enqueueSnackbar("Please Log in", {
            variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
            }
        })
        return <Navigate to="/shoppingApp/seller/login" replace={true} />;
    }

    return <>{children}</>;
};

export default SellerIsAuthenticated;
