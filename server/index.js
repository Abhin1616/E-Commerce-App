import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';
import MongoStore from 'connect-mongo';
import Customer from './models/customer.js';
import Seller from './models/seller.js';
import dotenv from "dotenv";
import cors from "cors";
import customerRoute from "./routes/customerRoute.js";
import sellerRoute from "./routes/sellerRoute.js"
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';


if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();
const mongoDbUrl = process.env.MONGODB_URL;
const secret = process.env.SECRET;
const refresh_secret = process.env.REFRESH_SECRET;

mongoose.connect(mongoDbUrl)
    .then(() => {
        console.log("DB connection successful");
        app.listen(3000, () => {
            console.log("Listening on Port 3000");
        });
    })
    .catch((e) => {
        console.log(e);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: 'http://localhost:5173', // replace with the origin of your client-side app
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())

const store = MongoStore.create({
    mongoUrl: mongoDbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function (e) {
    console.log('Session Store Error', e);
});

const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionOptions));

// Initialize Passport and set up session support
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for username/password authentication
passport.use('customer-local', new LocalStrategy(Customer.authenticate()));
passport.use('seller-local', new LocalStrategy(Seller.authenticate()));

// Passport JWT strategy for token authentication
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

passport.use(
    new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            // Check if the user exists in both customer and seller models
            let user = await Customer.findById(jwtPayload.sub).exec();

            if (!user) {
                user = await Seller.findById(jwtPayload.sub).exec();
            }

            if (!user) {
                return done(null, false);
            }

            // Include the userType in the user object
            user.userType = jwtPayload.userType;

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        // Check if the user is a Customer
        const customer = await Customer.findById(id).exec();
        if (customer) {
            customer.userType = 'customer';
            done(null, customer);
            return;
        }

        // Check if the user is a Seller
        const seller = await Seller.findById(id).exec();
        if (seller) {
            seller.userType = 'seller';
            done(null, seller);
            return;
        }

        // If the user is not found
        done(null, false);
    } catch (error) {
        done(error, false);
    }
});

app.use("/shoppingApp/customer", customerRoute(secret, refresh_secret))
app.use("/shoppingApp/seller", sellerRoute(secret, refresh_secret));


// Logout route
const verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    let token;
    if (authHeader) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(403).json({ message: 'Log in first' });
    }
    try {
        const data = jwt.verify(token, secret);
        req.user = data.user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired. Log in again.' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};
app.get('/shoppingApp/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ message: "Token valid" });
})
app.get('/shoppingApp/logout', verifyToken, (req, res) => {
    res.clearCookie('acc_token');
    res.json({ message: 'Logout successful' });
});
app.get("*", (req, res) => {
    res.status(404).json("Page Not Found!")
})
