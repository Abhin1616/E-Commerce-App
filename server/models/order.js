import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        total: {
            type: Number,
            required: true,
        }
    }],
    payment: {
        totalPrice: {
            type: Number,
            required: true
        }, payedPrice: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        }
    },
    shippingAddress: {
        addressType: {
            type: String,
            required: true,
            enum: ["home", "work"]
        },
        buildingName: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        landmark: {
            type: String
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phone: {
            type: Number,
            required: true
        }
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order
