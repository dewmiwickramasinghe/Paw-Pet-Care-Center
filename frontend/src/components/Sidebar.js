import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUndoAlt, FaFileInvoiceDollar, FaListAlt, FaWallet, FaMoneyCheckAlt, FaCogs, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          <span role="img" aria-label="paw">🐾</span> PawCare
        </h2>
        <p>Financial Manager</p>
      </div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">
            <FaChartBar /> Dashboard
          </Link>
        </li>
        <li className={location.pathname === '/refund-orders' ? 'active' : ''}>
          <Link to="/refund-orders">
            <FaUndoAlt /> Refund Orders
          </Link>
        </li>
        <li className={location.pathname === '/financial-reports' ? 'active' : ''}>
  <Link to="/financial-reports">
    <FaFileInvoiceDollar /> Financial Reports
  </Link>
</li>
        <li className={location.pathname === '/manage-status' ? 'active' : ''}>
  <Link to="/manage-status">
    <FaListAlt /> Manage Status
  </Link>
</li>
<li className={location.pathname === '/budgets' ? 'active' : ''}>
  <Link to="/budgets">
    <FaWallet /> Budgets
  </Link>
</li>

        <li className={location.pathname === '/transactions' ? 'active' : ''}>
  <Link to="/transactions">
    <FaMoneyCheckAlt /> Transactions
  </Link>
</li>
<li className={location.pathname === '/settings' ? 'active' : ''}>
  <Link to="/settings">
    <FaCogs /> Settings
  </Link>
</li>
      </ul>
      <button className="logout-btn"><FaSignOutAlt /> Logout</button>
    </div>
  );
};

export default Sidebar;
