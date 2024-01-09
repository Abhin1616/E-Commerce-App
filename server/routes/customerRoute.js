import express from 'express'
import jwt from 'jsonwebtoken';
import passport from "passport";
import { addAddress, addToCart, deleteAddress, editAddress, editProfile, home, login, orderHistory, orderProduct, profile, register, searchProduct, showCart, viewProduct } from '../controllers/customer.js';

const customerRoutes = (secret) => {

    const isAuthenticated = (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            let authHeader = req.headers.authorization;
            let token = authHeader.split(' ')[1];
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Unauthorized' });
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

    router.post('/register', register);
    router.post('/login', (req, res, next) => login(req, res, next, secret))
    router.get('/home', home);
    router.get('/home/product/:id', isAuthenticated, viewProduct);
    router.post('/home/product/:productId/add-to-cart', isAuthenticated, addToCart);
    router.get('/home/search', searchProduct);
    router.get('/home/products/cart', isAuthenticated, showCart);
    router.get("/home/products/order-history", isAuthenticated, orderHistory)
    router.post('/home/products/order', isAuthenticated, orderProduct);

    // Profile related routes
    router.route('/profile')
        .get(isAuthenticated, profile)
        .patch(isAuthenticated, editProfile);

    // Address related routes
    router.post('/profile/address', isAuthenticated, addAddress)

    router.route('/profile/address/:addressId')
        .patch(isAuthenticated, editAddress)
        .delete(isAuthenticated, deleteAddress);


    return router;
}

export default customerRoutes;
