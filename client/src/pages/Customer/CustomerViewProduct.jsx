import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Carousel from '../../components/Carousel';
import { enqueueSnackbar } from 'notistack'
import CartSlidebar from '../../components/CartSlidebar';
const CustomerViewProduct = () => {
    const [product, setProduct] = useState({})
    const { productId } = useParams()
    const [btn, changeBtn] = useState()
    const [showcartSidebar, setShowcartSidebar] = useState(false);
    const navigate = useNavigate()
    const addToCart = () => {
        axios.post(`http://localhost:3000/shoppingApp/customer/home/products/${productId}/add-to-cart`, {}, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                enqueueSnackbar(res.data.message, {
                    variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                console.log(res)
                changeBtn(true)
            })
            .catch((err) => {
                let message;
                let loc;
                if (err.response.data.error && err.response.data.error === "Unauthorized") {
                    message = "Please Log in"
                    loc = "/shoppingApp/login"
                } else if (err.response.data.error && err.response.data.error === "We're sorry! Only 5 unit(s) allowed in each orders") {
                    message = err.response.data.error
                    loc = location.pathname
                } else {
                    message = "Something went wrong"
                    loc = "/shoppingApp/home"
                }
                enqueueSnackbar(message, {
                    variant: 'error', autoHideDuration: 1800, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate(loc, { state: { from: location.pathname } })
                console.log(err)
            })
    }
    const buyNow = (productId) => {
        navigate('/shoppingApp/checkout', { state: { productId } });

    }
    useEffect(() => {
        axios.get(`http://localhost:3000/shoppingApp/customer/home/products/${productId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                setProduct(res.data.product)
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar(err.response.data.error, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                navigate('/shoppingApp/home')
            })
    }, [])
    return (
        <div>
            {product ? <div>
                {showcartSidebar === true && <CartSlidebar setShowcartSidebar={setShowcartSidebar} changeBtn={changeBtn} />}
                <div className='grid grid-cols-2 gap-2'>
                    <div style={{ position: 'relative' }}>
                        <Carousel images={product.image} quantity={product.quantity} />
                    </div>

                    <div className="product-view bg-slate-100 text-xl">

                        <div className='mx-10'>
                            <h1 className='text-3xl my-8'>Product Details</h1>
                            <h2> <b>Product Name</b>: {product.productName}</h2 >
                            <p><b>Price</b>: Rs {product.price}</p>
                            <p><b>Description</b>: {product.description}</p>
                            {product.quantity < 1 && <small className='text-red-600'>Out of stock</small>}
                            <div className='flex justify-between'>
                                {btn !== true ? <button onClick={addToCart} className={`text-base mt-8 px-3 py-2 text-white rounded-xl w-1/2 mr-3 ${product.quantity < 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-800'}`} disabled={product.quantity < 1}> Add to Cart</button> : <button onClick={() => { setShowcartSidebar(true) }} className="text-base bg-blue-600 mt-8 px-3 py-2 text-white hover:bg-blue-800 rounded-xl w-1/2 mr-3">Show Items</button>}


                                <button onClick={() => { buyNow(product._id) }} className={`text-base  mt-8 px-3 py-2 text-white  rounded-xl w-1/2 ml-3 ${product.quantity < 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={product.quantity < 1} >
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div >
                </div>
                <div>
                </div>
            </div> : <LoadingSpinner />}
        </div>
    )
}

export default CustomerViewProduct