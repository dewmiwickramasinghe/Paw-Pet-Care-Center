import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaExclamationCircle, FaCheckCircle, FaChartLine, FaMoneyBillAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [ordersRes, refundsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders'),
          axios.get('http://localhost:5000/api/cancelledorders')
        ]);
        
        setOrders(ordersRes.data || []);
        setCancelledOrders(refundsRes.data || []);
        setFilteredOrders(ordersRes.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter orders when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => 
      order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalRefunds = cancelledOrders.reduce((sum, refund) => sum + (refund.total || 0), 0);
  const netRevenue = totalRevenue - totalRefunds;
  const pendingOrders = orders.filter(order => order.deliveryStatus === 'Pending').length;
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  if (loading) return <div className="dashboard-loading">Loading dashboard data...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Financial Dashboard</h2>
      
      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button">
          <FaSearch />
        </button>
      </div>
      
      {/* Summary metrics */}
      <div className="metrics-container">
        <div className="metric-card primary">
          <div className="metric-icon"><FaChartLine /></div>
          <div className="metric-content">
            <div className="metric-value">LKR {totalRevenue.toLocaleString()}</div>
            <div className="metric-label">Total Revenue</div>
          </div>
        </div>
        
        <div className="metric-card danger">
          <div className="metric-icon"><FaExclamationCircle /></div>
          <div className="metric-content">
            <div className="metric-value">LKR {totalRefunds.toLocaleString()}</div>
            <div className="metric-label">Total Refunds</div>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon"><FaMoneyBillAlt /></div>
          <div className="metric-content">
            <div className="metric-value">LKR {netRevenue.toLocaleString()}</div>
            <div className="metric-label">Net Revenue</div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon"><FaCheckCircle /></div>
          <div className="metric-content">
            <div className="metric-value">{pendingOrders}</div>
            <div className="metric-label">Pending Orders</div>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-content">
            <div className="metric-value">LKR {avgOrderValue.toFixed(2)}</div>
            <div className="metric-label">Avg. Order Value</div>
          </div>
        </div>
        
        <div className="metric-card purple">
          <div className="metric-content">
            <div className="metric-value">{cancelledOrders.length}</div>
            <div className="metric-label">Refunds to Handle</div>
          </div>
        </div>
      </div>
      
      {/* Orders table */}
      <div className="orders-section">
        <h3>Recent Orders {searchQuery && `(Filtered by ID: ${searchQuery})`}</h3>
        
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            {searchQuery ? 'No orders found matching your search.' : 'No orders found.'}
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.payment?.name || '-'}</td>
                  <td>LKR {order.total?.toLocaleString() || 0}</td>
                  <td>
                    <span className={`status-badge ${order.deliveryStatus?.toLowerCase() || 'pending'}`}>
                      {order.deliveryStatus || 'Pending'}
                    </span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
