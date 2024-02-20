import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SalesPerYear from '../../components/SalesPerYear'
import ProductsSoldPerYear from '../../components/ProductsSoldPerYear'
import LoadingSpinner from '../../components/LoadingSpinner'
import SalesPerMonth from '../../components/SalesPerMonth'
import ProductsSoldPerMonth from '../../components/ProductsSoldPerMonth'

const SellerHome = () => {
    const y = new Date().getFullYear()
    const [data, setData] = useState()
    const [year, setYear] = useState(y)
    const [salesPerMonthInYear, setSalesPerMonthInYear] = useState()
    const [productsSoldPerMonthInYear, setProductsSoldPerMonthInYear] = useState({})

    const monthlySalesFunc = (value, data) => {
        let newSalesPerMonthInYear = {}, newProductsSoldPerMonthInYear = {};
        for (let key in data.salesPerMonth) {
            const [month, yearInKey] = key.split('-').map(Number);
            if (yearInKey === Number(value)) {
                newSalesPerMonthInYear[month] = data.salesPerMonth[key];
                newProductsSoldPerMonthInYear[month] = data.productsPerMonth[key];
            }
        }
        setSalesPerMonthInYear(newSalesPerMonthInYear)
        setProductsSoldPerMonthInYear(newProductsSoldPerMonthInYear)
        setYear(value)

    }
    useEffect(() => {
        axios.get("http://localhost:3000/shoppingApp/seller/home/view-sales-statistics", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                console.log(res)
                setData(res.data)
                monthlySalesFunc(year, res.data)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    const formatCompactNumber = (number) => {
        if (number < 100000) {
            return number;
        } else if (number >= 100000 && number < 1000000) {
            return `${parseFloat(number / 1000)} K`;
        } else if (number >= 1000000 && number < 1000000000) {
            return `${parseFloat(number / 1000000)} M`;
        } else if (number >= 1000000000 && number < 1000000000000) {
            return `${parseFloat(number / 1000000000)} B`;
        } else {
            return `${parseFloat(number / 1000000000000)} T`;
        }
    }

    return (
        <div>
            {data && salesPerMonthInYear && productsSoldPerMonthInYear ? <div className='mt-5'>
                <div className='grid grid-cols-11 text-center h-48'>
                    <div className='col-span-1 bg-white'></div>
                    <div className="col-span-3 border border-black rounded-l-lg bg-stone-300 flex items-center justify-center">
                        <Link className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" to="/shoppingApp/seller/products">Products Added</Link>
                    </div>
                    <div className="col-span-3 border-y border-black bg-stone-300 flex items-center justify-center">
                        <Link className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" to="/shoppingApp/seller/add-product">Add a product</Link>
                    </div>
                    <div className="col-span-3 border border-black rounded-r-lg bg-stone-300 flex items-center justify-center">
                        <Link className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" to="/shoppingApp/seller/view-orders">View Orders</Link>
                    </div>
                    <div className='col-span-1 bg-white'></div>
                </div>
                <div className='text-center mt-10'>
                    <span className='text-2xl'>Sales Statistics</span>
                    <div className='flex justify-evenly my-5 border border-black mx-[9%] py-3'>
                        <div>Total Earnings <div className='text-xl font-semibold mt-1'>{formatCompactNumber(data.totalSales)}</div></div>
                        <div>Total Products Sold<div className='text-xl font-semibold mt-1'>{formatCompactNumber(data.totalProductsSold)}</div></div>
                    </div>

                    <div className='flex justify-evenly my-10'>
                        <SalesPerYear SalesPerYear={data.salesPerYear} />
                        <ProductsSoldPerYear ProductsSoldPerYear={data.productsPerYear} />
                    </div>
                    <span className='text-xl mt-5'>Monthly Statistics for </span>
                    <select className='border hover:border-black' onChange={(e) => (monthlySalesFunc(e.target.value, data))} name="" id="" defaultValue={year}>
                        {Object.keys(data.salesPerYear).map((key) => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                    <div className='flex justify-evenly mt-5'>
                        <SalesPerMonth SalesPerMonth={salesPerMonthInYear} />
                        <ProductsSoldPerMonth ProductsSoldPerMonth={productsSoldPerMonthInYear} />

                    </div>
                </div>

            </div> : <LoadingSpinner />}
        </div>
    )
}

export default SellerHome
