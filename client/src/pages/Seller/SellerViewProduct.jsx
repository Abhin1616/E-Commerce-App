import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Carousel from '../../components/Carousel';
import { enqueueSnackbar } from 'notistack'
const SellerViewProduct = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({})
    const available = product.isAvailable;
    const { productId } = useParams()
    useEffect(() => {
        axios.get(`http://localhost:3000/shoppingApp/seller/home/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((res) => {
                setProduct(res.data)
            })
            .catch((err) => {
                console.log(err)
                enqueueSnackbar(err, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })

            })
    }, [])
    const toggleAvailability = () => {
        const token = localStorage.getItem("token")
        console.log(token)
        axios.patch(`http://localhost:3000/shoppingApp/seller/home/products/${productId}/toggle-availability`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                setProduct(res.data.product)
                enqueueSnackbar(res.data.message, {
                    variant: 'success', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })

            })
            .catch((err) => {
                enqueueSnackbar(err, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                console.log(err);

            })

    }
    const navigateEdit = () => {
        navigate(`/shoppingApp/seller/edit-product/${productId}`)
    }
    return (
        <div>
            {product ? <div>
                <div className='grid grid-cols-2 gap-2'>
                    <div>
                        <Carousel images={product.image} />
                    </div>
                    <div className="product-view bg-slate-100 text-xl">

                        <div className='mx-10'>
                            <h1 className='text-3xl my-8'>Product Details</h1>
                            <h2> <b>Product Name</b>: {product.productName}</h2 >
                            <p><b>Price</b>: {product.price}</p>
                            <p><b>Quantity</b>: {available ? <span className={product.quantity < 1 && "text-red-600"}>{product.quantity}</span> : <i style={{ textDecoration: "line-through" }}>{product.quantity}</i>}</p>
                            <p><b>Category</b>: {product.category}</p>
                            <p><b>Status</b>: {available ? "Available" : "Unavailable"}</p>
                            <p><b>Description</b>: {product.description}</p>
                            {product.quantity < 1 && <small className='text-red-600'>Out of stock</small>}
                            <div className='flex justify-between'>
                                <button onClick={() => (navigate("/shoppingApp/seller/products"))} className="text-base bg-stone-500 mt-8 px-3 py-2 text-white hover:bg-stone-600 rounded-xl w-[100px]">Back</button>
                                <button onClick={toggleAvailability} className={available ? 'text-base bg-red-500 mt-8 px-3 py-2 text-white hover:bg-red-700 rounded-xl' : 'text-base bg-green-500 mt-8 px-3 py-2 text-white hover:bg-green-700 rounded-xl'} >{available ? "Discontinue Product" : "Continue Product"}</button>

                                <button onClick={navigateEdit}
                                    className={`text-base mt-8 px-3 py-2 rounded-xl ${available ? 'bg-blue-500 hover:bg-blue-700 text-white' : ' bg-blue-400 cursor-not-allowed text-white'}`}
                                    disabled={!available}
                                >
                                    Edit Product
                                </button>
                            </div>
                        </div>
                    </div >
                </div>
                <div>
                </div>
            </div> : <LoadingSpinner />}
        </div>
    );
};

export default SellerViewProduct;
