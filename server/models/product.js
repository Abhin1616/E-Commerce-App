import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
})
const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    image: [imageSchema]

});

const Product = mongoose.model('Product', productSchema);

export default Product;
