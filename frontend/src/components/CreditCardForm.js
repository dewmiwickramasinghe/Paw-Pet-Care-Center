import React, { useState } from 'react';
import './CreditCardForm.css'; 

const CreditCardForm = ({ onPaymentSuccess }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [errors, setErrors] = useState({});

    const validateCardDetails = () => {
        const errors = {};

        if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            errors.cardNumber = 'Card number should be 16 digits';
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            errors.expiryDate = 'Expiry date should be in MM/YY format';
        }

        if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            errors.cvv = 'CVV should be 3 digits';
        }

        if (!cardHolderName || !/^[a-zA-Z ]+$/.test(cardHolderName)) {
            errors.cardHolderName = 'Card holder name should only contain letters and spaces';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handlePayment = async () => {
        if (validateCardDetails()) {
            const cardDetails = {
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv,
                cardHolderName: cardHolderName
            };

            onPaymentSuccess(cardDetails);
        }
    };

    return (
        <div className="credit-card-form">
            <h2>Enter Card Details</h2>
            <div className="form-group">
                <label>Card Number:</label>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter your card number"
                />
                {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}
            </div>

            <div className="form-group">
                <label>Expiry Date (MM/YY):</label>
                <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="Enter expiry date"
                />
                {errors.expiryDate && <p style={{ color: 'red' }}>{errors.expiryDate}</p>}
            </div>

            <div className="form-group">
                <label>CVV:</label>
                <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="Enter your CVV"
                />
                {errors.cvv && <p style={{ color: 'red' }}>{errors.cvv}</p>}
            </div>

            <div className="form-group">
                <label>Card Holder Name:</label>
                <input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="Enter your name"
                />
                {errors.cardHolderName && <p style={{ color: 'red' }}>{errors.cardHolderName}</p>}
            </div>

            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default CreditCardForm;
