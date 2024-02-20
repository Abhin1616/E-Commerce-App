import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { enqueueSnackbar } from 'notistack'

const CustomerHome = ({ searchTerm, setSearchTerm, category, searchRef, setSelectedCategory, selectedCategory }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const observer = useRef();
    const lastProductElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && products.length === page * limit) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [products, page, limit]);

    useEffect(() => {
        if (searchTerm && searchTerm != searchRef.current) {
            searchRef.current = searchTerm;
        } else {
            searchRef.current = null
        }
    }, [searchTerm]);
    useEffect(() => {
        const fetchData = async () => {
            let url;

            try {
                if (searchRef.current) {
                    url = `http://localhost:3000/shoppingApp/customer/home/search?q=${searchRef.current}&page=${page}&limit=${limit}`;
                    setSelectedCategory("All");
                } else if (selectedCategory !== "All") {
                    url = `http://localhost:3000/shoppingApp/customer/home/category?category=${category}&page=${page}&limit=${limit}`;
                    setSearchTerm("");
                } else {
                    url = `http://localhost:3000/shoppingApp/customer/home?page=${page}&limit=${limit}`;
                }
                const response = await axios.get(url);
                setProducts(prevProducts => [...prevProducts, ...response.data]);
            } catch (err) {
                enqueueSnackbar(err.response.data.message, {
                    variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                })
                setSearchTerm("");
                console.log('Failed to fetch products:', err);
            }
        };

        fetchData();
    }, [page, category]);


    return (
        <div>
            {products ? <div className="grid grid-cols-3 gap-4">
                {products.map((product, index) => (
                    <Link key={product._id} to={`/shoppingApp/products/${product._id}`}>
                        <div ref={index === products.length - 1 ? lastProductElementRef : null} key={product._id} className="border p-4 rounded text-center flex flex-col items-center">
                            {product.image.length > 0 && <img className='' src={product.image[0].url} style={{ width: "auto", height: "200px" }} alt="" />}
                            <h1>{product.productName}</h1>
                            <h1>Rs {product.price}</h1>
                        </div>
                    </Link>
                ))}

            </div> : <LoadingSpinner />}
        </div>
    );
};

export default CustomerHome;
