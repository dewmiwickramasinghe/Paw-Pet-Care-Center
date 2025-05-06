import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RefundOrders from './components/RefundOrders';
import ManageStatus from './components/ManageStatus';
import FinancialReports from './components/FinancialReports';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/refund-orders" element={<RefundOrders />} />
            <Route path="/manage-status" element={<ManageStatus />} />
            <Route path="/financial-reports" element={<FinancialReports />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/budgets" element={<Budget />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
