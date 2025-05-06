import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RefundOrders.css';

const RefundOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalRefund, setTotalRefund] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch cancelled orders
    axios.get('http://localhost:5000/api/cancelledorders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });

    // Fetch total refund amount
    axios.get('http://localhost:5000/api/cancelledorders/total')
      .then(res => {
        setTotalRefund(res.data.totalRefund);
      })
      .catch(err => {
        console.error('Error fetching total:', err);
      });
  }, []);

  const handleConfirmRefund = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cancelledorders/${orderId}`);
      
      // Remove the order from state
      setOrders(orders.filter(order => order._id !== orderId));
      
      // Update total refund amount
      const refundedOrder = orders.find(order => order._id === orderId);
      setTotalRefund(prev => prev - (refundedOrder?.total || 0));
      
      // Close the modal
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error processing refund:', err);
    }
  };

  if (loading) return <div className="refund-loading">Loading...</div>;
  if (!orders) return <div className="refund-error">No data fetched.</div>;
  if (orders.length === 0) return <div className="refund-error">No cancelled orders found.</div>;

  return (
    <div className="refund-orders-page">
      <h2 className="refund-title">Refund Orders</h2>
      <div className="refund-total">
        Total Refund Amount: <span>LKR {totalRefund.toLocaleString()}</span>
      </div>
      <div className="refund-orders-list">
        {orders.map((order, index) => (
          <div className="refund-card" key={order._id}>
            <div className="refund-card-content">
              <div className="refund-order-id">Order #{index + 1}</div>
              <div><b>Order ID:</b> {order.orderId?.toString() || '-'}</div>
              <div><b>Customer:</b> {order.payment?.name || '-'}</div>
              <div><b>Total:</b> LKR {order.total !== undefined ? order.total : 0}</div>
              <div><b>Cancelled At:</b> {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : '-'}</div>
              <div><b>Reason:</b> {order.cancellationReason || '-'}</div>
            </div>
            <button
              className="refund-pay-btn"
              onClick={() => setSelectedOrder(order)}
            >
              Pay Refund
            </button>
          </div>
        ))}
      </div>

      {/* Payment details modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Payment Details</h3>
            <div><b>Order ID:</b> {selectedOrder.orderId?.toString() || '-'}</div>
            <div><b>Customer:</b> {selectedOrder.payment?.name || '-'}</div>
            <div><b>Card:</b> {selectedOrder.payment?.cardNumberMasked || '-'}</div>
            <div><b>Expiry:</b> {selectedOrder.payment?.expiry || '-'}</div>
            <div><b>Total:</b> LKR {selectedOrder.total !== undefined ? selectedOrder.total : 0}</div>
            <div><b>Cancellation Reason:</b> {selectedOrder.cancellationReason || '-'}</div>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => handleConfirmRefund(selectedOrder._id)}
              >
                Confirm
              </button>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundOrders;
