import express from 'express'
import jwt from 'jsonwebtoken';
import passport from "passport";
import { addAddress, addToCart, deleteAddress, editAddress, editProfile, home, login, orderHistory, orderProduct, profile, register, searchProduct, showCart, viewProduct, updateCart, showAllCategories, categorizeProducts, checkout, viewAddress } from '../controllers/customer.js';

const customerRoutes = (secret) => {

    const isAuthenticated = (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {

            if (err) {
                return res.status(500).json({ error: err.message, message });
            }
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            let authHeader = req.headers.authorization;
            let token = authHeader.split(' ')[1];
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(403).json({ message: 'Token expired. Log in again.' });
                    } else {
                        return res.status(401).json({ error: 'Unauthorized' });
                    }

                } else {
                    // If the token is still valid, proceed to the next middleware
                    if (decoded.userType != "customer") {
                        return res.status(401).json({ error: 'Unauthorized' });
                    } else {
                        req.user = user;
                        next();
                    }
                }
            });
        })(req, res, next);
    };

    // const optionalAuth = (req, res, next) => {
    //     if (req.headers.authorization) {
    //         passport.authenticate('jwt', { session: false }, (err, user, info) => {
    //             if (err) {
    //                 return next(err);
    //             }
    //             if (!user) {
    //                 return res.status(401).json({ error: 'Unauthorized' });
    //             }
    //             let authHeader = req.headers.authorization;
    //             let token = authHeader.split(' ')[1];
    //             jwt.verify(token, secret, (err, decoded) => {
    //                 if (err) {
    //                     return res.status(401).json({ error: 'Unauthorized' });
    //                 } else {
    //                     // If the token is still valid, proceed to the next middleware
    //                     if (decoded.userType != "customer") {
    //                         return res.status(401).json({ error: 'Unauthorized' });
    //                     } else {
    //                         req.user = user;
    //                         console.log(req.user)
    //                         next();
    //                     }
    //                 }
    //             });
    //         })(req, res, next);
    //     } else {
    //         next();
    //     }
    // };



    const router = express.Router()
    router.get("/verify-token", isAuthenticated, (req, res) => {
        res.status(200).json({ message: "Token valid" });
    })
    router.post('/register', register);
    router.post('/login', (req, res, next) => login(req, res, next, secret))
    router.get('/home', home);

    // Profile related routes
    router.route('/profile')
        .get(isAuthenticated, profile)
        .patch(isAuthenticated, editProfile);

    // Address related routes
    router.post('/profile/address', isAuthenticated, addAddress)

    router.get('/home/categories', showAllCategories)
    router.get("/home/category", categorizeProducts)
    router.get('/home/search', searchProduct);
    router.get('/home/products/cart', isAuthenticated, showCart);
    router.post("/home/checkout", isAuthenticated, checkout)
    router.get("/home/products/order-history", isAuthenticated, orderHistory)
    router.post('/home/products/order', isAuthenticated, orderProduct);
    router.get('/home/products/:productId', viewProduct);
    router.post('/home/products/:productId/add-to-cart', isAuthenticated, addToCart);
    router.post('/home/products/cart/:productId/:action', isAuthenticated, updateCart);




    router.route('/profile/address/:addressId')
        .get(isAuthenticated, viewAddress)
        .patch(isAuthenticated, editAddress)
        .delete(isAuthenticated, deleteAddress);


    return router;
}

export default customerRoutes;
