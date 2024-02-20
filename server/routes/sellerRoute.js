import express from 'express'
import passport from "passport";
import jwt from 'jsonwebtoken';
import { addProduct, editProduct, editProfile, home, login, register, viewAddedProducts, viewProduct, viewProfile, viewOrders, viewSalesStatistics, toggleIsAvailable, viewSingleOrder } from '../controllers/seller.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
const upload = multer({ storage })

const sellerRoute = (secret) => {
    const isAuthenticated = (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, seller, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!seller) {
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
                    if (decoded.userType != "seller") {
                        return res.status(401).json({ error: 'Unauthorized' });
                    } else {
                        req.user = seller;
                        next();
                    }
                }
            });
        })(req, res, next);
    };

    const router = express.Router()
    router.get("/verify-token", isAuthenticated, (req, res) => {
        res.status(200).json({ message: "Token valid" });
    })
    router.post('/register', register)
    router.post('/login', (req, res, next) => login(req, res, next, secret))
    router.get("/home/products", isAuthenticated, viewAddedProducts)
    router.get('/home/products/:productId', isAuthenticated, viewProduct);
    router.patch('/home/products/:productId', isAuthenticated, upload.array('image'), editProduct);
    router.patch('/home/products/:productId/toggle-availability', isAuthenticated, toggleIsAvailable);
    router.get("/home/view-orders", isAuthenticated, viewOrders)
    router.get("/home/view-orders/:orderId", isAuthenticated, viewSingleOrder)
    router.get("/home/view-sales-statistics", isAuthenticated, viewSalesStatistics)
    router.route('/home')
        .get(isAuthenticated, home)
        .post(isAuthenticated, upload.array('image'), addProduct);
    router.route('/profile')
        .get(isAuthenticated, viewProfile)
        .patch(isAuthenticated, editProfile)
    return router;
}

export default sellerRoute
