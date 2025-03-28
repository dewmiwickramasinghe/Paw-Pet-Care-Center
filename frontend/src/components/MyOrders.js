import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [orderIdToCancel, setOrderIdToCancel] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/my-orders');
            setOrders(response.data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const cancelOrder = async () => {
        if (!cancelReason) {
            alert('Please enter a reason for cancellation');
            return;
        }
        try {
            const response = await axios.put(`/api/orders/cancel/${orderIdToCancel}`, {
                reason: cancelReason
            });
            if (response.status === 200) {
                // Remove the order from the page
                setOrders(orders.filter(order => order._id !== orderIdToCancel));
                setCancelReason('');
                setOrderIdToCancel(null);
            } else {
                console.error('Failed to cancel order');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancelClick = (orderId) => {
        setOrderIdToCancel(orderId);
    };

    return (
        <div className="my-orders-container">
            <h2>My Orders</h2>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-item">
                            <div className="order-details">
                                <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Total: Rs. {order.total}</p>
                                <p>Shipping Address: {order.shippingAddress}</p>
                                <p>Payment Method: {order.paymentMethod}</p>
                                <p>Status: {order.orderStatus}</p>
                                {/* Display items */}
                                <h3>Items:</h3>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item._id}>
                                            {item.name} - Quantity: {item.quantity} - Price: Rs. {item.price}
                                        </li>
                                    ))}
                                </ul>
                                {/* Cancel Order Button */}
                                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                    <button onClick={() => handleCancelClick(order._id)}>Cancel Order</button>
                                )}
                            </div>
                            {orderIdToCancel === order._id && (
                                <div>
                                    <input type="text" placeholder="Enter reason for cancellation" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                                    <button onClick={cancelOrder}>Confirm Cancellation</button>
                                </div>
                            )}
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default MyOrders;
