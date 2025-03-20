import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const receiptData = location.state?.receiptData;

    if (!receiptData) {
        return (
            <div className="receipt-container">
                <h2>No receipt data available</h2>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="receipt-container">
            <h1>Receipt</h1>
            <h3>Order Summary</h3>
            <ul>
                {receiptData.items.map((item, index) => (
                    <li key={index}>
                        {item.name} - Rs. {item.price} x {item.quantity} = Rs. {item.price * item.quantity}
                    </li>
                ))}
            </ul>
            <h3>Total: Rs. {receiptData.total}</h3>
            <h3>Shipping Address:</h3>
            <p>{receiptData.shippingAddress}</p>
            <h3>Payment Method:</h3>
            <p>{receiptData.paymentMethod}</p>
            <button className = "Button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default Receipt;
