import Joi from 'joi';

const customerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

});

const customerEditSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().custom((value, helper) => {
        if (value.toString().length !== 10) {
            return helper.message('Phone number must have 10 digits.');
        }
        return value;
    }, 'Phone number validation').required()
});

const sellerSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
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
        state: Joi.string().required(),
        pincode: Joi.number().custom((value, helper) => {
            if (value.toString().length !== 6) {
                return helper.message('Pincode must have 6 digits.');
            }
            return value;
        }, 'Pincode validation').required()


    }
});

const productSchema = Joi.object({
    productName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    category: Joi.string().required(),
});
const addressSchema = Joi.object({
    addressType: Joi.string().required(),
    buildingName: Joi.string().required(),
    street: Joi.string().required(),
    landmark: Joi.string(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().integer().required()
});
export { customerSchema, sellerSchema, productSchema, addressSchema, customerEditSchema };