import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ isOpen, toggleCart, closeCart, cartItems, removeFromCart, updateCartItemQuantity }) => {
    if (!isOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);

    return (
        <div className="cart-modal">
            <div className="cart-content">
                <span className="close-button" onClick={toggleCart}>&times;</span>
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>Rs. {item.price.toFixed(2)}</p> {/* Display the correct price */}
                                    <div className="quantity-controls">
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            value={item.quantity || 1}
                                            min="1"
                                            onChange={(e) => updateCartItemQuantity(item._id, e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="remove-button" onClick={() => {
                                    console.log("Removing item with ID:", item._id);
                                    removeFromCart(item._id);
                                }}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="cart-total">
                            Total: Rs. {total}
                        </div>
                        <Link to="/">  {/* Link to the products page */}
                            <button className="update-cart-button" onClick={closeCart}> {/* close cart when updating */}
                                Update Cart
                            </button>
                        </Link>
                        <Link to="/checkout">
                            <button className="checkout-button" onClick={closeCart}>
                                Proceed to Checkout
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
