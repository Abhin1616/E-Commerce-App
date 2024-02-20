import Joi from 'joi';

const customerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid("male", "female", "others").required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
        .required(),

    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required()
}).unknown(false);

const customerEditSchema = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "others").required(),
    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required()
}).unknown(false);

const sellerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid("male", "female", "others").required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
        .required(),

    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required(),
    businessName: Joi.string().required(),
    address: {
        street: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().valid("Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
            "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
            "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal").required(),
        pincode: Joi.number().custom((value, helper) => {
            if (value.toString().length !== 6) {
                return helper.message('Pincode must have 6 digits.');
            }
            return value;
        }, 'Pincode validation').required()


    }
}).unknown(true);

const sellerEditSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required(),
    gender: Joi.string().valid("male", "female", "others").required(),
    businessName: Joi.string().required(),
    address: {
        street: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().valid("Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
            "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
            "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal").required(),
        pincode: Joi.number().custom((value, helper) => {
            if (value.toString().length !== 6) {
                return helper.message('Pincode must have 6 digits.');
            }
            return value;
        }, 'Pincode validation').required()


    }
}).unknown(false);

const productSchema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    category: Joi.string().required(),
}).unknown(true);

const addressSchema = Joi.object({
    addressType: Joi.string().valid("home", "work").required(),
    buildingName: Joi.string().required(),
    street: Joi.string().required(),
    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required(),
    landmark: Joi.string(),
    district: Joi.string().required(),
    state: Joi.string().valid("Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal").required(),
    pincode: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 6) {
            return helper.message('Pincode must have 6 digits.');
        }
        return value;
    }, 'Pincode validation').required()
});
const orderSchema = Joi.object({
    payedPrice: Joi.number().required(),
    paymentMethod: Joi.string().valid('upi', 'cod', 'card').required(),
    address: Joi.object().required()
}).unknown(true);


export { customerSchema, sellerSchema, productSchema, addressSchema, customerEditSchema, sellerEditSchema, orderSchema };