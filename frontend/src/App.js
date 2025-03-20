import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import Receipt from './components/Receipt'; // Import the Receipt component
import './App.css';

// Image URL for the cart icon
const cartImageUrl = "https://media.istockphoto.com/id/1206806317/vector/shopping-cart-icon-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=1RRQJs5NDhcB67necQn1WCpJX2YMfWZ4rYi1DFKlkNA%3D";

function App() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateCartItemQuantity = (productId, newQuantity) => {
        setCart(cart.map(item =>
            item._id === productId ? { ...item, quantity: parseInt(newQuantity) } : item
        ));
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <div className="header-left">
                        <h1>Paw pet care center</h1>
                    </div>
                    <div className="header-right">
                        <input type="text" placeholder="Search product here..." />
                        <button className="search-button">Search</button>
                        <div className="cart-info" onClick={toggleCart}>
                            <span className="cart-items-count">{cart.length}</span>
                            <img
                                src={cartImageUrl}
                                alt="Cart"
                                style={{ width: '30px', height: '30px' }} // Adjust size here
                            />
                            <span className="username">My cart</span>
                            <button className="logout-button">Logout</button>
                        </div>
                    </div>
                </header>
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<ProductList addToCart={addToCart} />} />
                        <Route path="/checkout" element={<Checkout
                            cartItems={cart}
                            setCart={setCart} // Pass setCart to Checkout
                        />} />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/receipt" element={<Receipt />} /> {/* Add the Receipt route */}
                    </Routes>
                </main>
                <Cart
                    isOpen={isCartOpen}
                    toggleCart={toggleCart}
                    closeCart={closeCart}
                    cartItems={cart}
                    removeFromCart={removeFromCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                />
            </div>
        </Router>
    );
}

export default App;
