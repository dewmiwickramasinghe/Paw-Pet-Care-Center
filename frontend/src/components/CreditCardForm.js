import React, { useState } from 'react';
import './CreditCardForm.css';

const CreditCardForm = ({ onPaymentSuccess }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate successful payment without any card verification
        setTimeout(() => {
            alert('Payment Successful!');
            onPaymentSuccess({ // Pass the card details as part of receipt data
                cardNumber,
                expiryDate,
                cvv,
                cardHolderName
            });
        }, 2000); // Simulate 2 seconds processing time
    };

    return (
        <form className="credit-card-form" onSubmit={handleSubmit}>
            <h2>Enter Credit Card Details</h2>
            <div className="form-group">
                <label htmlFor="cardNumber">Card Number:</label>
                <input
                    type="text"
                    id="cardNumber"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date:</label>
                <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cvv">CVV:</label>
                <input
                    type="text"
                    id="cvv"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="cardHolderName">Card Holder Name:</label>
                <input
                    type="text"
                    id="cardHolderName"
                    placeholder="Card Holder Name"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Pay Now</button>
        </form>
    );
};

export default CreditCardForm;
