import Seller from '../models/seller.js';
import jwt from 'jsonwebtoken';
import { sellerSchema, productSchema, sellerEditSchema } from '../joiSchemas.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

export const register = async (req, res) => {
    try {
        console.log(req.body)
        const { error } = sellerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, username, email, password, phone, businessName, gender } = req.body;

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
        const user = await Seller.register(new Seller({ name, username, email, phone, businessName, gender, address }), password);

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
            return res.status(400).json("Invalid username or password");
        }

        seller.authenticate(password, (err, authenticatedSeller, error) => {
            if (err) { return next(err); }
            if (!authenticatedSeller) { return res.status(400).json("Invalid username or password"); }
            const token = jwt.sign({ sub: authenticatedSeller._id, userType: 'seller', username: seller.username }, secret, { expiresIn: '1h' });
            res.cookie('acc_token', token, { httpOnly: true });
            res.json({ token });

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
        if (req.files.length == 0) {
            return res.status(404).json({ error: 'Image is required' });
        }
        const { productName, description, price, quantity, category } = req.body;
        const cloudinaryInfo = req.files.map((file) => ({
            url: file.path,
            filename: file.filename,
            cloudinary: file.cloudinary,
        }));

        const product = new Product({
            productName,
            description,
            price,
            quantity,
            category,
            seller: req.user._id,
            image: cloudinaryInfo,
        });

        await product.save();
        res.status(200).json("Product added successfully!");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


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

        // Update the product's data
        for (let key in update) {
            if (key !== 'images' && key != "isAvailable") {
                product[key] = update[key];
            }
        }
        if (req.files.length) {
            const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
            product.image.push(...images);
        }


        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const toggleIsAvailable = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const available = product.isAvailable;
        product.isAvailable = !available;
        await product.save()
        res.json({ product, message: available ? 'Product set to unavailable' : "Product is available now" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const viewOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().sort({ createdAt: -1 }).populate(['products.product', 'customer']);
        const sellerOrders = allOrders.map(order => {
            // Filter the products in the order to only include those sold by the current user
            const sellerProducts = order.products.filter(product =>
                product.product.seller.toString() === req.user._id.toString()
            );
            // Return a new object that contains the order info and only the products sold by the current user
            return { ...order._doc, products: sellerProducts };
        }).filter(order => order.products.length > 0); // Remove orders that don't contain any products sold by the current user


        res.status(200).json({ sellerOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const viewSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate(['products.product', 'customer']);
        const sellerProducts = order.products.filter(product =>
            product.product.seller.toString() === req.user._id.toString()
        );
        order.products = sellerProducts
        res.status(200).json(order);
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
        let salesPerMonth = {};
        let salesPerYear = {};
        let productsPerMonth = {};
        let productsPerYear = {};

        // Loop over each order
        allOrders.forEach(order => {
            // Get the month and year when the order was created
            const monthYear = `${order.createdAt.getMonth() + 1}-${order.createdAt.getFullYear()}`;
            const year = order.createdAt.getFullYear().toString();

            // Initialize if not already done
            if (!salesPerMonth[monthYear]) {
                salesPerMonth[monthYear] = 0;
            }
            if (!salesPerYear[year]) {
                salesPerYear[year] = 0;
            }
            if (!productsPerMonth[monthYear]) {
                productsPerMonth[monthYear] = 0;
            }
            if (!productsPerYear[year]) {
                productsPerYear[year] = 0;
            }

            // Loop over each product in the order
            order.products.forEach(product => {
                // If the seller of the product is the current user, add to the totals
                if (product.product.seller.toString() === req.user._id.toString()) {
                    const productTotal = product.total;
                    totalSales += productTotal;
                    totalProductsSold += product.quantity;

                    // Add to the monthly and yearly sales
                    salesPerMonth[monthYear] += productTotal;
                    salesPerYear[year] += productTotal;

                    // Add to the monthly and yearly products sold
                    productsPerMonth[monthYear] += product.quantity;
                    productsPerYear[year] += product.quantity; // New line
                }
            });
        });

        // Send the response
        res.status(200).json({ totalSales, totalProductsSold, salesPerMonth, salesPerYear, productsPerMonth, productsPerYear }); // New parameter
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

