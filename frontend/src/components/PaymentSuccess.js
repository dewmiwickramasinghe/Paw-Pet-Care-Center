import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptData = location.state?.receiptData; // Get receipt data from navigation state

    const handleViewReceipt = () => {
        navigate('/receipt', { state: { receiptData } }); // Pass receipt data to the receipt page
    };

    return (
        <div className="payment-success-container">
            <h1>Payment Successful!</h1>
            <p>Thank you for your order!</p>
            {receiptData && (
                <>
                    <button className="view-receipt-button" onClick={handleViewReceipt}>
                        View Receipt
                    </button>
                </>
            )}
            <button className="back-home-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};

export default PaymentSuccess;
