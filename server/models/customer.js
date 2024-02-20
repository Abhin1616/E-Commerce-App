import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'others']
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
            default: 0,
        }
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]

});

// Plugin passport-local-mongoose into the Customer schema
customerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Create a Customer model based on the schema
const Customer = mongoose.model('Customer', customerSchema);

// Export the Customer model
export default Customer;
