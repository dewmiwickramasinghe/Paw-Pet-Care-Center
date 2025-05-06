import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './FinancialReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const FinancialReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [refundData, setRefundData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('monthly');

  const formatData = useCallback((orders, refunds) => {
    if (timeFrame === 'daily') {
      setRevenueData(getDailyData(orders, 30));
      setRefundData(getDailyData(refunds, 30));
    } else {
      setRevenueData(getMonthlyData(orders, 12));
      setRefundData(getMonthlyData(refunds, 12));
    }
  }, [timeFrame]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const [ordersRes, refundsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders'),
          axios.get('http://localhost:5000/api/cancelledorders')
        ]);
        const orders = ordersRes.data || [];
        const refunds = refundsRes.data || [];
        formatData(orders, refunds);
      } catch (err) {
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinancialData();
  }, [timeFrame, formatData]);

  function getDailyData(transactions, days) {
    const result = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => {
        if (!t?.createdAt) return false;
        const transactionDate = new Date(t.createdAt).toISOString().split('T')[0];
        return transactionDate === dateString;
      });
      const total = dayTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      result.push({
        date: dateString,
        total,
        count: dayTransactions.length
      });
    }
    return result;
  }

  function getMonthlyData(transactions, months) {
    const result = [];
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const yearMonth = date.toISOString().slice(0, 7);
      const monthTransactions = transactions.filter(t => {
        if (!t?.createdAt) return false;
        const transactionDate = new Date(t.createdAt).toISOString().slice(0, 7);
        return transactionDate === yearMonth;
      });
      const total = monthTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
      result.push({
        month: yearMonth,
        total,
        count: monthTransactions.length
      });
    }
    return result;
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item?.total || 0), 0);
  const totalRefunds = refundData.reduce((sum, item) => sum + (item?.total || 0), 0);
  const netRevenue = totalRevenue - totalRefunds;
  const totalOrders = revenueData.reduce((sum, item) => sum + (item?.count || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const chartLabels = timeFrame === 'daily'
    ? revenueData.map(item => (item?.date ? item.date.slice(5) : ''))
    : revenueData.map(item => {
        if (!item?.month) return '';
        const [year, month] = item.month.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short' });
      });

  const revenueChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(item => item?.total || 0),
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
      {
        label: 'Refunds',
        data: refundData.map(item => item?.total || 0),
        backgroundColor: 'rgba(211, 47, 47, 0.5)',
        borderColor: 'rgba(211, 47, 47, 1)',
        borderWidth: 1,
      }
    ],
  };

  if (loading) return <div className="reports-loading">Loading financial data...</div>;

  return (
    <div className="financial-reports-container">
      <h2 className="reports-title">Financial Reports</h2>
      <div className="reports-controls">
        <div className="time-selector">
          <button
            className={`time-btn ${timeFrame === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeFrame('daily')}
          >
            Daily
          </button>
          <button
            className={`time-btn ${timeFrame === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeFrame('monthly')}
          >
            Monthly
          </button>
        </div>
        <button className="download-btn" onClick={() => window.print()}>
          Download Report
        </button>
      </div>
      <div className="reports-summary">
        <div className="summary-card">
          <div className="card-title">Total Revenue</div>
          <div className="card-value">LKR {totalRevenue.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">Total Refunds</div>
          <div className="card-value">LKR {totalRefunds.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">Net Revenue</div>
          <div className="card-value">LKR {netRevenue.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">Avg. Order Value</div>
          <div className="card-value">LKR {averageOrderValue.toFixed(2)}</div>
        </div>
      </div>
      <div className="reports-charts">
        <div className="chart-container">
          <h3>
            Revenue vs Refunds ({timeFrame === 'daily' ? 'Last 30 Days' : 'Last 12 Months'})
          </h3>
          <Bar data={revenueChartData} />
        </div>
      </div>
      <div className="reports-table">
        <h3>{timeFrame === 'daily' ? 'Daily Breakdown' : 'Monthly Breakdown'}</h3>
        <table>
          <thead>
            <tr>
              <th>{timeFrame === 'daily' ? 'Date' : 'Month'}</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Refunds</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item, index) => (
              <tr key={index}>
                <td>
                  {timeFrame === 'daily'
                    ? item?.date || ''
                    : item?.month || ''}
                </td>
                <td>{item?.count || 0}</td>
                <td>LKR {item?.total?.toLocaleString() || 0}</td>
                <td>LKR {(refundData[index]?.total || 0).toLocaleString()}</td>
                <td>
                  LKR {((item?.total || 0) - (refundData[index]?.total || 0)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReports;
