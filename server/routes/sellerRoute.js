import express from 'express'
import passport from "passport";
import jwt from 'jsonwebtoken';
import { addProduct, home, login, register, viewAddedProducts } from '../controllers/seller.js';

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
            if (token !== req.cookies.acc_token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Unauthorized' });
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
    router.post('/register', register)
    router.post('/login', (req, res, next) => login(req, res, next, secret))
    router.get('/home', isAuthenticated, home)
    router.post('/home', isAuthenticated, addProduct);
    router.get("/home/products", isAuthenticated, viewAddedProducts)
    return router;
}

export default sellerRoute
