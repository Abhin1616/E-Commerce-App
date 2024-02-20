import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
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
})

const Address = mongoose.model("Address", addressSchema)

export default Address;



