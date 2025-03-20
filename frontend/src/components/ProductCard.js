import React from 'react';

const ProductCard = ({ product, addToCart }) => (
    <div className="card">
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
        <p>Rs.{product.price}</p>
        <p>{product.description}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
);

export default ProductCard;
