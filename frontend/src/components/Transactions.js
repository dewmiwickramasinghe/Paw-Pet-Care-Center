import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [received, setReceived] = useState([]);
  const [refunded, setRefunded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/orders'),
      axios.get('http://localhost:5000/api/cancelledorders')
    ]).then(([ordersRes, refundsRes]) => {
      setReceived(ordersRes.data || []);
      setRefunded(refundsRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="transactions-loading">Loading transactions...</div>;

  return (
    <div className="transactions-page">
      <h2 className="transactions-title">Transactions</h2>

      <div className="transactions-section">
        <h3>Payments Received</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {received.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order._id}</td>
                <td>{order.payment?.name || '-'}</td>
                <td>LKR {order.total || 0}</td>
                <td>{order.status || '-'}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="transactions-section">
        <h3>Payments Refunded</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Refunded At</th>
            </tr>
          </thead>
          <tbody>
            {refunded.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.orderId || order._id}</td>
                <td>{order.payment?.name || '-'}</td>
                <td>LKR {order.total || 0}</td>
                <td>{order.cancellationReason || '-'}</td>
                <td>{order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
