import Customer from '../models/customer.js';
import jwt from 'jsonwebtoken';
import Product from '../models/product.js';
import Order from '../models/order.js'
import { customerSchema, addressSchema, customerEditSchema, orderSchema } from '../joiSchemas.js';
import Address from '../models/address.js';


export const register = async (req, res) => {
    try {
        const { error } = customerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { name, username, email, password, phone, gender } = req.body;

        // Check if the username already exists
        const existingUser = await Customer.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with the given username is already registered' });
        }

        // Check if the email already exists
        const existingEmail = await Customer.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'A user with the given email is already registered' });
        }

        // Check if the phone already exists
        const existingPhone = await Customer.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ error: 'A user with the given phone number is already registered' });
        }

        // Use passport-local-mongoose to register the user
        const user = await Customer.register(new Customer({ name, username, email, phone, gender }), password);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const login = async (req, res, next, secret) => {
    try {
        const { identifier, password } = req.body;
        const user = await Customer.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
        if (!user) {
            return res.status(400).json('Invalid username or email');
        }

        user.authenticate(password, (err, authenticatedUser, error) => {
            if (err) { return next(err); }
            if (!authenticatedUser) { return res.status(400).json('Invalid username or email'); }
            const token = jwt.sign({ sub: authenticatedUser._id, userType: 'customer' }, secret, { expiresIn: '1hr' });
            res.cookie('acc_token', token, { httpOnly: true })
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json("Something went wrong!");
    }
}

export const home = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find({ isAvailable: true }).skip(skip).limit(limit).populate("seller");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const viewProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}
export const showAllCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $match: { isAvailable: true } },
            { $group: { _id: "$category" } }
        ]);
        const availableCategories = categories.map(category => category._id);
        res.json(availableCategories);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}


export const categorizeProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category } = req.query;
        const filteredProducts = await Product.find({ category, isAvailable: true }).skip(skip).limit(limit);
        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.quantity < 1) {
            return res.status(400).json({ error: 'Not enough product in stock' });
        }
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Find the product in the cart
        const cartProductIndex = customer.cart.findIndex(cp => cp.product.toString() === productId);

        // If the product is already in the cart, increase the quantity
        if (cartProductIndex >= 0) {
            if (customer.cart[cartProductIndex].quantity + 1 > product.quantity) {
                return res.status(400).json({ error: 'Not enough product in stock' });
            }
            if (customer.cart[cartProductIndex].quantity >= 5) {
                return res.status(400).json({ error: "We're sorry! Only 5 unit(s) allowed in each orders" });
            }
            customer.cart[cartProductIndex].quantity += 1;
            customer.cart[cartProductIndex].price += product.price; // Assuming product.price is the price per item
        } else {
            // If the product is not in the cart, add it with a quantity of 1 and set the price
            customer.cart.push({ product, quantity: 1, price: product.price });
        }

        await customer.save();
        res.json({ "message": "Added to Cart!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const searchProduct = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    if (!req.query.q) {
        const products = await Product.find().skip(skip).limit(limit).lean();
        return res.json(products)
    }
    try {
        let query = req.query.q;
        if (query.length <= 2) {
            return res.status(404).json({ message: 'No products found matching your search criteria' });
        }
        query = query.replace(/\s/g, ''); // Remove spaces from the query
        const regex = new RegExp(query.split("").join("\\s*"), 'i');
        const matchedProducts = await Product.find({ productName: { $regex: regex }, isAvailable: true }).skip(skip).limit(limit).lean();
        if (matchedProducts.length === 0) {
            return res.status(404).json({ message: 'No products found matching your search criteria' });
        }
        res.json(matchedProducts);
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'An error occurred while searching for the product.' });
    }
}



export const updateCart = async (req, res, next) => {
    try {
        const { productId, action } = req.params; // action can be 'increase', 'decrease', or 'remove'
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Find the product in the cart
        const cartProductIndex = customer.cart.findIndex(cp => cp.product.toString() === productId);

        // If the product is in the cart, increase or decrease the quantity, or remove it
        if (cartProductIndex >= 0) {
            const product = await Product.findById(productId); // Fetch the product to get its price
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (action === 'increase') {
                if (customer.cart[cartProductIndex].quantity >= 5) {
                    return res.status(400).json({ error: "We're sorry! Only 5 unit(s) allowed in each orders" });
                }
                customer.cart[cartProductIndex].quantity += 1;
                customer.cart[cartProductIndex].price += product.price;
            } else if (action === 'decrease') {
                if (customer.cart[cartProductIndex].quantity <= 1) {
                    return res.status(400).json({ error: 'Minimum quantity: 1' });
                }
                customer.cart[cartProductIndex].quantity -= 1;
                customer.cart[cartProductIndex].price -= product.price;
            } else if (action === 'remove') {
                customer.cart.splice(cartProductIndex, 1);
            } else {
                return res.status(400).json({ error: 'Invalid action' });
            }
        } else {
            return res.status(404).json({ error: 'Product not in cart' });
        }

        await customer.save();
        res.json({ "message": "Cart updated!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const showCart = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        let grandTotal = 0
        const customer = await Customer.findById(customerId).populate("cart.product");
        const userDetails = { name: customer.name, email: customer.email, phone: customer.phone }
        const products = customer.cart;
        for (let product of products) {
            grandTotal += product.price
        }
        customer.cart.length ? res.json({ products, grandTotal, userDetails }) : res.json("Your cart is empty");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const checkout = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId).populate(["cart.product", "address"]);
        if (customer.address.length > 0) {
            const userDetails = { name: customer.name, email: customer.email, phone: customer.phone, address: customer.address }
            if (req.body.productId) {
                const { productId } = req.body
                const product = await Product.findById(productId)
                const grandTotal = product.price;
                return res.json({ product, grandTotal, userDetails })
            } else {
                for (let cartProduct of customer.cart) {
                    const product = await Product.findById(cartProduct.product._id);
                    const quantity = cartProduct.quantity;
                    if (product.quantity < quantity) {
                        return res.status(400).json({ error: `Uh-oh! Only ${product.quantity} units of ${product.productName} are left in stock.` })
                    }
                }
                let grandTotal = 0
                const products = customer.cart;

                for (let product of products) {
                    grandTotal += product.price
                }
                customer.cart.length ? res.json({ grandTotal, userDetails }) : res.json("Your cart is empty");
            }
        } else {
            return res.status(400).json({ error: "Add your Address" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const orderProduct = async (req, res, next) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        if (customer.address.length) {
            let orderProducts = [];
            let grandTotal = 0;
            if (req.body.productId) {
                // Buy Now
                const product = await Product.findById(req.body.productId);
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                if (product.quantity === 0) {
                    return res.json("Out of Stock")
                }
                const quantity = 1; // Set the quantity to 1 for Buy Now
                const total = product.price * quantity; // Multiply the product price by the quantity
                orderProducts.push({ product, quantity, total });
                grandTotal += total;

                // Decrease the quantity of the product
                product.quantity -= quantity;
                await product.save();
            } else {
                // Buy All Products in Cart
                if (customer.cart.length) {

                    await customer.populate('cart.product');

                    for (let cartProduct of customer.cart) {
                        const product = await Product.findById(cartProduct.product._id);
                        const quantity = cartProduct.quantity;
                        if (product.quantity < quantity) {
                            return res.status(400).json(`Uh-oh! Only ${product.quantity} units of ${product.productName} are left in stock.`)
                        }
                    }
                    for (let cartProduct of customer.cart) {
                        const product = await Product.findById(cartProduct.product._id);
                        const quantity = cartProduct.quantity; // Get the quantity from the cart
                        const total = product.price * quantity; // Multiply the product price by the quantity
                        orderProducts.push({ product, quantity, total });
                        grandTotal += total;

                        // Decrease the quantity of the product
                        product.quantity -= quantity;
                        await product.save();
                    }

                } else {
                    return res.status(404).json({ error: 'Your cart is empty' });
                }
            }
            const { error } = orderSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const { payedPrice, paymentMethod, address } = req.body;
            const order = new Order({
                customer,
                products: orderProducts,
                payment: { totalPrice: grandTotal, payedPrice, paymentMethod },
                shippingAddress: {
                    addressType: address.addressType,
                    buildingName: address.buildingName,
                    street: address.street,
                    district: address.district,
                    landmark: address.landmark,
                    state: address.state,
                    pincode: address.pincode,
                    phone: address.phone
                }
            });
            await order.save();
            // Add the order to the customer's order history
            customer.orderHistory.push(order);
            await customer.save();
            // If it's a "Buy All Products in Cart" action, clear the cart
            if (!req.body.productId) {
                customer.cart = [];
                await customer.save();
            }
            res.json({ message: 'Order placed successfully!' });
        } else {
            res.status(400).json({ error: "Add your Address" })
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: 'An error occurred while placing the order.' });
    }
}

export const orderHistory = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: 'orderHistory',
                options: { sort: { 'createdAt': -1 } }, // Sort orders by createdAt in descending order
                populate: {
                    path: 'products.product', // populate product in each product object
                }
            });
        const allOrders = customer.orderHistory;
        if (!allOrders.length) {
            return res.json("Start shopping to fill your order history!")
        }
        const allOrderedProducts = []
        const otherDetails = []
        for (let order of allOrders) {
            allOrderedProducts.push(order.products)
            const createdAt = new Date(order.createdAt);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

            const formattedDate = `Ordered on ${createdAt.toLocaleDateString(undefined, options)}`;
            otherDetails.push([order.payment, order.shippingAddress, formattedDate, order._id])
        }

        res.status(200).json({ otherDetails, allOrderedProducts });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while retrieving the order history' });
    }
}

export const profile = async (req, res) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId).populate("address");
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the profile.' });
    }
}


export const editProfile = async (req, res) => {
    try {
        const customerId = req.user._id; // Get the customer id from req.user
        const { error } = customerEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const update = req.body; // Get the new data from the request body

        // Find the customer by id
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        // Update the customer's  data
        for (let key in update) {
            customer[key] = update[key];
        }
        // Save the updated customer data
        await customer.save();

        // Send the updated customer data as a response
        res.status(200).json({ message: "User Details edited successfully" });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'An error occurred while updating the profile.' });
    }

}
export const addAddress = async (req, res) => {
    try {
        const customerId = req.user._id; // Get the customer id from req.user
        const { error } = addressSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const update = req.body; // Get the new data from the request body

        // Find the customer by id
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const newAddress = new Address(update);
        await newAddress.save();

        // Add the new address to the customer's address array
        customer.address.push(newAddress);

        // Save the updated customer data
        await customer.save();
        // Send the updated customer data as a response
        res.status(200).json({ message: "Address added successfully" });
    }
    catch (error) {
        // Handle any errors
        console.log(error)
        res.status(500).json({ error: 'An error occurred while adding the address.' });
    }

}
export const viewAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await Address.findById(addressId)
        res.json(address)
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the address.' });
    }
}
export const editAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { error } = addressSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const update = req.body; // Get the new data from the request body

        // Find the customer who is trying to edit the address
        const customer = await Customer.findById(req.user.id);

        // Check if the addressId is in the customer's address array
        if (!customer.address.includes(addressId)) {
            return res.status(403).json({ error: 'You do not have permission to edit this address.' });
        }

        const address = await Address.findByIdAndUpdate(addressId, update, { new: true })
        res.json("Address updated successfully")
    }
    catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'An error occurred while updating the address.' });
    }
}

export const deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    try {
        // Find the customer and remove the address reference
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId);
        if (customer.address.length > 1) {
            await Address.findByIdAndDelete(addressId);
            customer.address = customer.address.filter(id => id.toString() !== addressId);
            await customer.save();
            res.json({ message: "Address removed successfully" });
        } else {
            res.status(400).json({ error: 'Cannot remove the last remaining address.' });
        }
    }
    catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'An error occurred while removing the address.' });
    }
}



