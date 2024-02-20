import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CardPayment = ({ orderProduct }) => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const years = []
    const currentYear = new Date().getFullYear();
    for (let i = 1; i <= 10; i++) {
        years.push(currentYear + i)
    }
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const [cardSide, setCardSide] = useState('front');

    const onSubmit = (data) => {
        console.log(data)
        orderProduct()
        reset()
    };
    const handleInput = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    const handleInputChange = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add a space every 4 digits
        setValue('cardNumber', value);
    };
    const handleInputChangeCvv = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        setValue('securityCode', value);
    };

    const handleChangeCardSide = (side) => {
        setCardSide(side);
    };
    const cardholder = watch('cardholder', '');
    const cardNumber = watch('cardNumber', '');
    const expiryMonth = watch('expiryMonth', '');
    const expiryYear = watch('expiryYear', '');
    const securityCode = watch('securityCode', '');
    const registerOptions = {
        cardholder: {
            required: "Name is required",
            minLength: { value: 3, message: "Card holder Name must be at least 3 characters" },
            pattern: { value: /^[A-Za-z\s]+$/, message: "Card holder must only contain letters and spaces" }
        },
        cardNumber: {
            required: "Card number is required",
            pattern: { value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, message: "Invalid card number format" }
        },
        expiryMonth: {
            required: "Expiry month is required",
            min: { value: 1, message: "Expiry month must be between 1 and 12" },
            max: { value: 12, message: "Expiry month must be between 1 and 12" }
        },
        expiryYear: {
            required: "Expiry year is required",
            min: { value: new Date().getFullYear(), message: "Expiry year cannot be in the past" }
        },
        securityCode: {
            required: "Security code is required",
            pattern: { value: /^\d{3}$/, message: "Security code must be 3  digits" }
        }
    };


    return (
        <div className="m-4 w-[70%]">
            <div className="credit-card w-full sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                <header className="flex flex-col justify-center items-center">
                    <div
                        className="relative"
                        style={{ display: cardSide === 'front' ? 'block' : 'none' }}
                    >
                        <img
                            className="w-full h-auto"
                            src="https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/svg-cards/card-visa-front.png"
                            alt="front credit card"
                        />
                        <div className="front bg-transparent text-lg w-full text-white px-12 absolute left-0 bottom-12">
                            <p className="number mb-5 sm:text-xl">{cardNumber || "0000 0000 0000 0000"}</p>
                            <div className="flex flex-row justify-between">
                                <p>{cardholder || "CARD HOLDER"}</p>
                                <div>
                                    <span>{expiryMonth || "MM"}</span>
                                    <span>/</span>
                                    <span>{expiryYear || "YY"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="relative"
                        style={{ display: cardSide === 'back' ? 'block' : 'none' }}
                    >
                        <img
                            className="w-full h-auto"
                            src="https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/svg-cards/card-visa-back.png"
                            alt=""
                        />
                        <div
                            className="bg-transparent text-white text-xl w-full flex justify-end absolute bottom-20 px-8 sm:bottom-24 right-0 sm:px-12"
                        >
                            <div className="border border-white w-16 h-9 flex justify-center items-center">
                                <p>{securityCode || "CVV"}</p>
                            </div>
                        </div>
                    </div>
                    <ul className="flex">
                        <li className="mx-2">
                            <img
                                className="w-16"
                                src="https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/computop.png"
                                alt=""
                            />
                        </li>
                        <li className="mx-2">
                            <img
                                className="w-14"
                                src="https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/verified-by-visa.png"
                                alt=""
                            />
                        </li>
                        <li className="ml-5">
                            <img
                                className="w-7"
                                src="https://www.computop-paygate.com/Templates/imagesaboutYou_desktop/images/mastercard-id-check.png"
                                alt=""
                            />
                        </li>
                    </ul>
                </header>
                <main className="mt-4 p-4">
                    <h1 className="text-xl font-semibold text-gray-700 text-center">Card payment</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="my-3">
                                <input
                                    onInput={handleInput}
                                    type="text"
                                    className="block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none cursor-pointer"
                                    placeholder="Card holder"
                                    maxLength="20"
                                    {...register("cardholder", registerOptions.cardholder)}
                                    onSelect={() => { handleChangeCardSide("front") }}
                                />
                                {errors.cardholder && <small className="text-red-500">{errors.cardholder.message}</small>}
                            </div>
                            <div className="my-3">
                                <input
                                    onInput={handleInputChange}
                                    type="text"
                                    className="block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none cursor-pointer"
                                    placeholder="Card number"
                                    maxLength="19"
                                    {...register("cardNumber", registerOptions.cardNumber)}
                                    onSelect={() => { handleChangeCardSide("front") }}

                                />
                                {errors.cardNumber && <small className="text-red-500">{errors.cardNumber.message}</small>}
                            </div>
                            <div className="my-3 flex flex-col">
                                <div className="mb-2">
                                    <label htmlFor="" className="text-gray-700">Expired</label>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                                    <div>
                                        <select
                                            onFocus={() => { handleChangeCardSide("front") }}
                                            name=""
                                            id=""
                                            defaultValue=""
                                            className="form-select appearance-none block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none cursor-pointer"
                                            {...register("expiryMonth", registerOptions.expiryMonth)}
                                        >
                                            <option value="" disabled>MM</option>
                                            {months.map((mth, index) => (<option key={index} value={mth}>{mth}</option>))}
                                        </select>
                                        {errors.expiryMonth && <small className="text-red-500">{errors.expiryMonth.message}</small>}
                                    </div>
                                    <div>
                                        <select
                                            onFocus={() => { handleChangeCardSide("front") }}
                                            name=""
                                            id=""
                                            defaultValue=""
                                            className="form-select appearance-none block w-full px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none cursor-pointer"
                                            {...register("expiryYear", registerOptions.expiryYear)}
                                        >
                                            <option value="" disabled>YY</option>
                                            {years.map((year, index) => (<option key={index} value={year}>{year}</option>))}
                                        </select>
                                        {errors.expiryYear && <small className="text-red-500">{errors.expiryYear.message}</small>}
                                    </div>
                                    <div>
                                        <input
                                            onFocus={() => { handleChangeCardSide("back") }}
                                            onInput={handleInputChangeCvv}
                                            type="text"
                                            className="block w-full col-span-2 px-5 py-2 border rounded-lg bg-white shadow-lg placeholder-gray-400 text-gray-700 focus:ring focus:outline-none cursor-pointer"
                                            placeholder="CVV"
                                            maxLength="3"
                                            {...register("securityCode", registerOptions.securityCode)}
                                        />
                                        {errors.securityCode && <small className="text-red-500">{errors.securityCode.message}</small>}
                                    </div>
                                </div>
                            </div>
                            {/* Other input fields can be added here */}
                        </div>
                        <footer className="mt-6 p-4">
                            <button
                                className="submit-button px-4 py-3 rounded-full bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600 w-full text-xl font-semibold transition-colors"
                                type="submit"
                            >
                                Pay now
                            </button>
                        </footer>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default CardPayment;
