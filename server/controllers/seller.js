import Seller from '../models/seller.js';
import jwt from 'jsonwebtoken';
import { sellerSchema, productSchema, sellerEditSchema } from '../joiSchemas.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

export const register = async (req, res) => {
    try {
        const { error } = sellerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, username, email, password, phone, businessName } = req.body;
        // Use passport-local-mongoose to register the user
        const { street, district, state, pincode } = req.body.address
        const address = { street, district, state, pincode }
        // Check if the username already exists
        const existingUsername = await Seller.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'This username is already taken. Please try another.' });
        }
        // Check if the email already exists
        const existingEmail = await Seller.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'An account with this email already exists. Please use a different email.' });
        }

        // Check if the business name already exists
        const existingBusiness = await Seller.findOne({ businessName });
        if (existingBusiness) {
            return res.status(400).json({ error: 'The business name you have chosen is already in use. Please select a different name.' });
        }
        const user = await Seller.register(new Seller({ name, username, email, phone, businessName, address }), password);

        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const login = async (req, res, next, secret) => {
    try {
        const { identifier, password } = req.body;

        // Assuming you have a Seller model
        const seller = await Seller.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!seller) {
            return res.status(400).json({ "error": "Invalid username or email" });
        }

        seller.authenticate(password, (err, authenticatedSeller, error) => {
            if (err) { return next(err); }
            if (!authenticatedSeller) { return res.status(400).json({ "error": "Invalid username or email" }); }
            const token = jwt.sign({ sub: authenticatedSeller._id, userType: 'seller', username: seller.username }, secret, { expiresIn: '1h' });
            res.cookie('acc_token', token, { httpOnly: true })
            res.json(token);

        });
    } catch (error) {
        res.status(500).json("Something went wrong!");

    }
}

export const home = (req, res, next) => {
    res.status(200).json({ message: 'Seller: You have access to this protected route!' });
}

export const addProduct = async (req, res, next) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { productName, description, price, quantity, category } = req.body;
        const product = new Product({ productName, description, price, quantity, category, seller: req.user._id });
        await product.save()
        res.status(200).json("Product added successfully!");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const viewAddedProducts = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user._id);
        const products = await Product.find({ seller })
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const viewProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user._id);
        res.status(200).json(seller)

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const editProfile = async (req, res) => {
    try {
        const { error } = sellerEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const update = req.body
        const seller = await Seller.findById(req.user._id);
        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }
        // Update the seller's  data
        for (let key in update) {
            if (key !== 'email' && key !== "username" && key !== "email") {
                seller[key] = update[key];
            }
        }
        await seller.save()
        res.status(200).json({ message: 'Profile updated successfully', seller });


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "An error occured while updating the profile" });

    }
}
export const viewProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}


export const editProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const update = req.body;
        for (let key in update) {
            product[key] = update[key];
        }
        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const setUnavailable = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        product.isAvailable = false;
        await product.save()
        res.json({ message: 'Product set to unavailable' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const viewOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().populate('products.product');
        const sellerOrders = allOrders.map(order => {
            // Filter the products in the order to only include those sold by the current user
            const sellerProducts = order.products.filter(product =>
                product.product.seller.toString() === req.user._id.toString()
            );
            // Return a new object that contains the order info and only the products sold by the current user
            return { ...order._doc, products: sellerProducts };
        }).filter(order => order.products.length > 0); // Remove orders that don't contain any products sold by the current user

        // Map through the orders and return only the product and its quantity
        const productAndQuantity = sellerOrders.map(order => {
            return order.products.map(product => {
                return {
                    product: product.product,
                    quantity: product.quantity
                };
            });
        });

        res.status(200).json(productAndQuantity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const viewSalesStatistics = async (req, res) => {
    try {
        // Fetch all orders and populate the product details
        const allOrders = await Order.find().populate('products.product');

        let totalSales = 0;
        let totalProductsSold = 0;

        // Loop over each order
        allOrders.forEach(order => {
            // Loop over each product in the order
            order.products.forEach(product => {
                // If the seller of the product is the current user, add to the totals
                if (product.product.seller.toString() === req.user._id.toString()) {
                    totalSales += product.total;
                    totalProductsSold += product.quantity;
                }
            });
        });

        // Send the response
        res.status(200).json({ totalSales, totalProductsSold });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
