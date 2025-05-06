import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order handler
  const cancelOrder = async (orderId) => {
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason || reason.trim() === '') {
      alert('Cancellation reason is required.');
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
      alert('Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Inline styles
  const styles = {
    container: {
      padding: 20,
      maxWidth: 1200,
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      marginTop: 20,
    },
    th: {
      padding: '16px 10px',
      textAlign: 'left',
      background: '#f6f8fa',
      color: '#222',
      fontWeight: 600,
      borderBottom: '1px solid #ddd',
    },
    td: {
      padding: '16px 10px',
      verticalAlign: 'top',
      borderBottom: '1px solid #eee',
    },
    trHover: {
      backgroundColor: '#f0f7ff',
      transition: 'background 0.2s',
    },
    orderItemRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 8,
    },
    orderItemImg: {
      width: 56,
      height: 56,
      objectFit: 'cover',
      borderRadius: 8,
      border: '1px solid #e0e0e0',
      marginRight: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      backgroundColor: '#fafbfc',
    },
    cancelBtn: {
      backgroundColor: '#ff4d4f',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      padding: '6px 14px',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    cancelBtnHover: {
      backgroundColor: '#d9363e',
    },
    cannotCancelBtn: {
      backgroundColor: '#ccc',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      padding: '6px 14px',
      cursor: 'not-allowed',
    },
  };

  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;
  if (error) return <p style={{ color: 'red', padding: 20 }}>Error: {error}</p>;
  if (orders.length === 0) return <p style={{ padding: 20 }}>No orders found.</p>;

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={{ marginBottom: 12 }}>My Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Items</th>
            <th style={styles.th}>Total (Rs.)</th>
            <th style={styles.th}>Payment Name</th>
            <th style={styles.th}>Card Number</th>
            <th style={styles.th}>Order Date</th>
            <th style={styles.th}>Delivery Status</th>
            <th style={styles.th}>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <motion.tr
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ cursor: 'default' }}
              whileHover={{ backgroundColor: '#f0f7ff' }}
            >
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>
                {order.items.map(item => (
                  <div key={item._id} style={styles.orderItemRow}>
                    <img
  src={item.image || 'https://via.placeholder.com/56?text=No+Image'}
  alt={item.name}
  style={styles.orderItemImg}
  onError={(e) => {
    console.error('Image load error:', item.image);
    e.target.src = 'https://via.placeholder.com/56?text=No+Image';
  }}
/>

                    <span>{item.name} x {item.quantity}</span>
                  </div>
                ))}
              </td>
              <td style={styles.td}>{order.total.toFixed(2)}</td>
              <td style={styles.td}>{order.payment?.name || 'N/A'}</td>
              <td style={styles.td}>{order.payment?.cardNumberMasked || 'N/A'}</td>
              <td style={styles.td}>{new Date(order.createdAt).toLocaleString()}</td>
              <td style={styles.td}>{order.deliveryStatus || 'Pending'}</td>
              <td style={styles.td}>
                {order.deliveryStatus === 'Delivered' ? (
                  <button style={styles.cannotCancelBtn} disabled>
                    Cannot Cancel
                  </button>
                ) : (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => cancelOrder(order._id)}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#d9363e')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ff4d4f')}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default MyOrders;
