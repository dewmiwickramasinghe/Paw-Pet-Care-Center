import React, { useContext, useState } from "react";
import { CartContext } from "../utils/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [localCart, setLocalCart] = useState(cartItems);
  const navigate = useNavigate();

  // Remove item
  const handleRemove = (id) => {
    setLocalCart(localCart.filter((item) => item._id !== id));
  };

  // Change quantity
  const handleQuantityChange = (id, qty, maxQty) => {
    if (qty < 1 || qty > maxQty) return;
    setLocalCart(
      localCart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // Update cart globally and go to Store
  const handleUpdateCart = () => {
    setCartItems(localCart);
    navigate("/Store"); // Redirect to Store after updating
  };

  // Go to checkout
  const handleCheckout = () => {
    setCartItems(localCart); // Ensure latest changes are saved
    navigate("/checkout");
  };

  // Total price
  const totalPrice = localCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Cart</h2>
      {localCart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-info"
        >
          Your cart is empty.
        </motion.div>
      ) : (
        <>
          <ul className="list-group mb-4">
            <AnimatePresence>
              {localCart.map((item) => (
                <motion.li
                  key={item._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={`data:image/jpeg;base64,${item.photo}`}
                      alt={item.name}
                      style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                    />
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <small className="text-muted">Rs. {item.price}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={item.qty}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value), item.qty)
                      }
                      className="form-control"
                      style={{ width: 70 }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#dc3545", color: "#fff" }}
                      className="btn btn-outline-danger"
                      onClick={() => handleRemove(item._id)}
                      title="Remove"
                    >
                      <i className="bi bi-trash"></i>
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Total: Rs. {totalPrice.toFixed(2)}</h4>
          </div>
          <div className="d-flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#0d6efd", color: "#fff" }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary flex-grow-1"
              onClick={handleUpdateCart}
            >
              Update Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#198754", color: "#fff" }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-success flex-grow-1"
              onClick={handleCheckout}
            >
              Go to Checkout
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
