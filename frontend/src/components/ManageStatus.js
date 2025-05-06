import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageStatus.css';

const ManageStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status options for dropdown
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        deliveryStatus: newStatus
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Error updating status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="status-loading">Loading orders...</div>;
  if (error) return <div className="status-error">{error}</div>;
  if (!orders.length) return <div className="status-empty">No orders found</div>;

  return (
    <div className="manage-status-container">
      <h2 className="status-title">Manage Order Status</h2>
      <div className="orders-list">
        {orders.map((order, idx) => (
          <div className="order-item" key={order._id}>
            <h3 className="order-number">Order #{idx + 1}</h3>
            <div className="order-details">
              <div className="order-detail">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{order._id}</span>
              </div>
              <div className="order-detail">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">{order.payment?.name || '-'}</span>
              </div>
              <div className="order-detail">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">LKR {order.total || 0}</span>
              </div>
              <div className="order-detail">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="order-detail status-control">
                <span className="detail-label">Status:</span>
                <select 
                  className={`status-select status-${(order.deliveryStatus || 'pending').toLowerCase()}`}
                  value={order.deliveryStatus || 'Pending'}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStatus;
