import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    // Fields specific to Google authentication
    phone: {
        type: Number,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        }
    },
});

// Plugin passport-local-mongoose into the Seller schema
sellerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Create a Seller model based on the schema
const Seller = mongoose.model('Seller', sellerSchema);

// Export the Seller model
export default Seller;
