import React, { useState, useContext } from "react";
import { CartContext } from "../../utils/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const validateName = (name) => /^[A-Za-z ]+$/.test(name.trim());
const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s+/g, ""));
const validateExpiry = (expiry) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [mm, yy] = expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const expDate = new Date(2000 + yy, mm - 1, 1);
  return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
};
const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

const Checkout = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [form, setForm] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? item.qty ?? 1), 0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "name") {
      filteredValue = value.replace(/[^A-Za-z ]/g, "");
    } else if (name === "cardNumber") {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 16);
    } else if (name === "expiry") {
      filteredValue = value.replace(/[^0-9/]/g, "").slice(0, 5);
    } else if (name === "cvv") {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 4);
    }

    setForm({ ...form, [name]: filteredValue });
    setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const errs = {};
    if (!validateName(form.name)) errs.name = "Name must only contain letters and spaces";
    if (!validateCardNumber(form.cardNumber)) errs.cardNumber = "Card number must be exactly 16 digits";
    if (!validateExpiry(form.expiry)) errs.expiry = "Expiry must be valid (MM/YY) and in the future";
    if (!validateCVV(form.cvv)) errs.cvv = "CVV must be 3 or 4 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);

    // Ensure each item has _id, name, price, quantity (not qty)
    const orderItems = cartItems.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity ?? item.qty ?? 1,
    }));

    // Debug: log what you are sending
    console.log("Sending order:", orderItems);

    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        cart: orderItems,
        payment: {
          name: form.name,
          cardNumber: form.cardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
        },
        total,
      });
      setCartItems([]);
      navigate(`/receipt/${response.data.orderId}`);
    } catch (err) {
      // Show real error in browser console for debugging
      console.error("Order error:", err.response?.data || err.message);
      setErrors({ submit: "Payment failed. Try again." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="container py-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
            <div className="mb-3">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Name on Card"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                maxLength="16"
                placeholder="1234567812345678"
                autoComplete="off"
              />
              {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Expiry (MM/YY)</label>
                <input
                  type="text"
                  className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  maxLength="5"
                  placeholder="MM/YY"
                  autoComplete="off"
                />
                {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
              </div>
              <div className="col">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  maxLength="4"
                  autoComplete="off"
                  placeholder="CVV"
                />
                {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
              </div>
            </div>
            <div className="mb-3">
              <strong>Total: Rs. {total.toFixed(2)}</strong>
            </div>
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn btn-success w-100"
              disabled={processing}
            >
              {processing ? "Processing..." : "Pay & Place Order"}
            </motion.button>
          </form>
        </div>
        <div className="col-md-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-light rounded shadow-sm">
            <h5>Order Summary</h5>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.name} x {item.quantity ?? item.qty ?? 1}</span>
                  <span>Rs. {(item.price * (item.quantity ?? item.qty ?? 1)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <h6 className="text-end">Total: <b>Rs. {total.toFixed(2)}</b></h6>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
