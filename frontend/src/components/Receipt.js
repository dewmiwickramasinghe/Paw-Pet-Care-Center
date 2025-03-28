import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Receipt.css';

const Receipt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const receiptData = location.state?.receiptData;

    if (!receiptData) {
        return <p>No receipt data available.</p>;
    }

    const calculateSubtotal = (item) => {
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
            return item.price * item.quantity;
        } else {
            return 0; // Or handle the error in a way that's appropriate for your app
        }
    };

    return (
        <div className="receipt-container">
            <h1>Receipt</h1>
            <h3>Order Summary</h3>
            <ul>
                {receiptData.items && receiptData.items.map((item, index) => {
                    const subtotal = calculateSubtotal(item);
                    return (
                        <li key={index}>
                            {item.name} - Rs. {item.price} x {item.quantity} = Rs. {subtotal}
                        </li>
                    );
                })}
            </ul>
            <h3>Total: Rs. {receiptData.total}</h3>
            <h3>Shipping Address:</h3>
            <p>{receiptData.shippingAddress}</p>
            <h3>Payment Method:</h3>
            <p>{receiptData.paymentMethod}</p>
            <button className="Button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default Receipt;
