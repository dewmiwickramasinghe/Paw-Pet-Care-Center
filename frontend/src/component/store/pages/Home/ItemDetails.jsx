import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function ItemDetails({ cart, setCart }) {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch item details by ID
                const response = await axios.get(`http://localhost:5000/inventory-items/${itemId}`);
                if (!response.data) {
                    throw new Error('Item not found');
                }
                setItem(response.data);
                
                // Fetch related items from the same category
                if (response.data.category && response.data.category._id) {
                    const allItems = await axios.get('http://localhost:5000/store-items');
                    const related = allItems.data
                        .filter(i => 
                            i._id !== response.data._id && 
                            i.category && 
                            i.category._id === response.data.category._id
                        )
                        .slice(0, 4);
                    setRelatedItems(related);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching item:', error);
                setError('Error fetching item details. Please try again later.');
                setLoading(false);
            }
        };
    
        fetchData();
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [itemId]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0 && value <= (item?.qty || 1)) {
            setQuantity(value);
        }
    };

    const incrementQuantity = () => {
        if (quantity < (item?.qty || 1)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!item || item.qty <= 0) {
            setNotification('This item is out of stock.');
            return;
        }

        const itemInCart = cart.find((cartItem) => cartItem._id === item._id);

        if (itemInCart) {
            const newQuantity = itemInCart.quantity + quantity;
            
            if (newQuantity <= item.qty) {
                setCart(
                    cart.map((cartItem) =>
                        cartItem._id === item._id
                            ? { ...itemInCart, quantity: newQuantity }
                            : cartItem
                    )
                );
                setNotification(`Added ${quantity} more ${item.name} to your cart!`);
            } else {
                setNotification(`Cannot add more than ${item.qty} of ${item.name} to the cart.`);
            }
        } else {
            setCart([...cart, { ...item, quantity }]);
            setNotification(`${quantity} ${item.name} added to your cart!`);
        }
    };

    // Notification component
    const Notification = ({ message, onClose }) => (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="position-fixed top-0 start-50 translate-middle-x p-3 mt-3 z-3"
            style={{ maxWidth: '90%', width: '400px' }}
        >
            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <i className="fas fa-bell me-2 text-primary"></i>
                    <strong className="me-auto">Notification</strong>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="toast-body">{message}</div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <AnimatePresence>
                {notification && (
                    <Notification message={notification} onClose={() => setNotification(null)} />
                )}
            </AnimatePresence>

            

            <div className="container py-4 flex-grow-1">
                {/* Breadcrumb */}
                

                {/* Back button */}
                <div className="mb-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Products
                    </button>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="text-center py-5 my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading product details...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                    </div>
                ) : item ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="row g-0">
                                {/* Product Image */}
                                <div className="col-lg-5 position-relative bg-white">
                                    {/* Status badges */}
                                    <div className="position-absolute top-0 start-0 p-3 d-flex flex-column gap-1 z-1">
                                        {item.qty <= 2 && item.qty > 0 && (
                                            <span className="badge bg-warning text-dark">
                                                <i className="fas fa-exclamation-triangle me-1"></i>
                                                Low Stock
                                            </span>
                                        )}
                                        {item.qty === 0 && (
                                            <span className="badge bg-danger">
                                                <i className="fas fa-times-circle me-1"></i>
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                    
                                    {item.category && (
                                        <span className="position-absolute top-0 end-0 m-3 badge bg-primary z-1">
                                            {item.category.name}
                                        </span>
                                    )}
                                    
                                    <motion.div 
                                        className="h-100 d-flex align-items-center justify-content-center p-4"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={`data:image/jpeg;base64,${item.photo}`}
                                            alt={item.name}
                                            className="img-fluid"
                                            style={{ 
                                                maxHeight: '400px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </motion.div>
                                </div>
                                
                                {/* Product Details */}
                                <div className="col-lg-7">
                                    <div className="card-body p-4 p-lg-5">
                                        <h1 className="card-title h3 fw-bold mb-3">{item.name}</h1>
                                        
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="fs-3 fw-bold text-primary me-3">
                                                Rs.{item.price?.toFixed(2)}
                                            </span>
                                            
                                            {item.qty > 0 ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                                    <i className="fas fa-times-circle me-1"></i>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                        
                                        {item.companyName && (
                                            <p className="text-muted mb-3">
                                                <strong>Brand:</strong> {item.companyName}
                                            </p>
                                        )}
                                        
                                        <hr className="my-4" />
                                        
                                        <div className="mb-4">
                                            <h5 className="fw-bold mb-3">Description</h5>
                                            <p className="card-text">
                                                {item.description || "No description available for this product."}
                                            </p>
                                        </div>
                                        
                                        {item.qty > 0 && (
                                            <div className="mb-4">
                                                <label htmlFor="quantity" className="form-label fw-bold mb-2">
                                                    Quantity
                                                </label>
                                                <div className="input-group" style={{ width: '150px' }}>
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        type="button"
                                                        onClick={decrementQuantity}
                                                        disabled={quantity <= 1}
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input 
                                                        type="number" 
                                                        className="form-control text-center" 
                                                        id="quantity"
                                                        value={quantity}
                                                        onChange={handleQuantityChange}
                                                        min="1"
                                                        max={item.qty}
                                                    />
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        type="button"
                                                        onClick={incrementQuantity}
                                                        disabled={quantity >= item.qty}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                                <small className="text-muted d-block mt-2">
                                                    {item.qty} items available
                                                </small>
                                            </div>
                                        )}
                                        
                                        <div className="d-grid gap-2 d-md-flex">
                                            <button
                                                className={`btn ${item.qty === 0 ? 'btn-secondary' : 'btn-primary'} py-2 px-4`}
                                                onClick={handleAddToCart}
                                                disabled={item.qty === 0}
                                            >
                                                {item.qty === 0 ? (
                                                    <>
                                                        <i className="fas fa-times-circle me-2"></i>
                                                        Out of Stock
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-cart-plus me-2"></i>
                                                        Add to Cart
                                                    </>
                                                )}
                                            </button>
                                            
                                            <Link to="/cart" className="btn btn-outline-primary py-2 px-4">
                                                <i className="fas fa-shopping-cart me-2"></i>
                                                View Cart
                                            </Link>
                                        </div>
                                        
                                        {/* Product metadata */}
                                        <div className="mt-4 pt-3 border-top">
                                            <div className="row g-2 text-muted small">
                                                {item.code && (
                                                    <div className="col-6">
                                                        <strong>Product Code:</strong> {item.code}
                                                    </div>
                                                )}
                                                {item.category && (
                                                    <div className="col-6">
                                                        <strong>Category:</strong> {item.category.name}
                                                    </div>
                                                )}
                                                <div className="col-6">
                                                    <strong>Availability:</strong> {item.qty > 0 ? 'In Stock' : 'Out of Stock'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : null}

                {/* Related Products */}
                {!loading && !error && relatedItems.length > 0 && (
                    <div className="mt-5">
                        <h2 className="h4 fw-bold mb-4">Related Products</h2>
                        <div className="row g-4">
                            {relatedItems.map((relatedItem, index) => (
                                <div key={relatedItem._id} className="col-sm-6 col-lg-3">
                                    <motion.div
                                        className="card h-100 border-0 shadow-sm product-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    >
                                        <div className="position-relative">
                                            <Link to={`/store-items/${relatedItem._id}`} className="text-decoration-none">
                                                <img
                                                    src={`data:image/jpeg;base64,${relatedItem.photo}`}
                                                    alt={relatedItem.name}
                                                    className="card-img-top"
                                                    style={{ height: "160px", objectFit: "cover" }}
                                                />
                                            </Link>
                                            
                                            {relatedItem.category && (
                                                <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
                                                    {relatedItem.category.name}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="card-body d-flex flex-column">
                                            <h3 className="h6 card-title mb-2">
                                                <Link to={`/store-items/${relatedItem._id}`} className="text-decoration-none text-dark stretched-link">
                                                    {relatedItem.name}
                                                </Link>
                                            </h3>
                                            
                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <span className="fw-bold text-primary">Rs.{relatedItem.price.toFixed(0)}</span>
                                                {relatedItem.qty > 0 ? (
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            
        </div>
    );
}

export default ItemDetails;