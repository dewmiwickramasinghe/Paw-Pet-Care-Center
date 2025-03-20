import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';

const ProductList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
        </div>
    );
};

export default ProductList;
