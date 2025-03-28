import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreditCardForm from './CreditCardForm';
import './Checkout.css';
import axios from 'axios';

const Checkout = ({ cartItems, setCart }) => {
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [shippingAddress, setShippingAddress] = useState('');
    const navigate = useNavigate();

    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);

    const handlePaymentSuccess = async (cardDetails) => {
        try {
            const checkoutData = {
                creditCardDetails: cardDetails,
                items: cartItems,
                total: total,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod
            };

            const response = await axios.post('http://localhost:5000/api/checkout/place-order', checkoutData);

            if (response.status === 201) {
                setCart([]);
                navigate('/payment-success', {
                    state: { receiptData: checkoutData }
                });
            } else {
                console.error('Failed to save checkout details');
                alert('Failed to save checkout details. Please try again.');
            }
        } catch (error) {
            console.error('Error saving checkout details:', error);
            alert('Error saving checkout details. Please try again.');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
            ) : (
                <>
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>Rs. {item.price}</p>
                                    <div className="quantity-controls">
                                        <label>Quantity:</label>
                                        <span>{item.quantity || 1}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total">
                            Total: Rs. {total}
                        </div>
                    </div>

                    <div className="shipping-address">
                        <h3>Shipping Address</h3>
                        <input
                            type="text"
                            placeholder="Enter your shipping address"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="payment-options">
                        <h3>Payment Options</h3>
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    value="creditCard"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={() => setPaymentMethod('creditCard')}
                                />
                                Credit Card
                            </label>
                        </div>
                        <div className="payment-method">
                            <label>
                                <input
                                    type="radio"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                />
                                PayPal
                            </label>
                        </div>
                    </div>

                    {paymentMethod === 'creditCard' ? (
                        <CreditCardForm onPaymentSuccess={handlePaymentSuccess} />
                    ) : (
                        <button className="pay-button" onClick={handlePaymentSuccess}>Pay with PayPal</button>
                    )}
                </>
            )}
        </div>
    );
};

export default Checkout;
