import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';
import GeneratePDF from './GeneratePDF';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const InventorySummaryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory-items');
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const calculateSummary = () => {
    const summary = {};

    items.forEach((item) => {
      const { category, name, qty, buyingPrice, price } = item;
      const total = qty * buyingPrice;
      const profit = (price - buyingPrice) * qty;

      // Handle cases where category is null or undefined
      const categoryName = category?.name || 'Uncategorized';

      if (!summary[categoryName]) {
        summary[categoryName] = {
          items: [],
          categoryTotal: 0,
          categoryProfit: 0,
        };
      }

      summary[categoryName].items.push({
        name,
        qty,
        buyingPrice,
        price,
        total,
        profit,
      });

      summary[categoryName].categoryTotal += total;
      summary[categoryName].categoryProfit += profit;
    });

    return summary;
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  // Calculate total stats
  const summary = calculateSummary();
  const totalProfit = Object.keys(summary).reduce(
    (acc, category) => acc + summary[category].categoryProfit, 
    0
  );
  const totalCost = Object.keys(summary).reduce(
    (acc, category) => acc + summary[category].categoryTotal,
    0
  );
  const lowStockItems = items.filter((item) => item.qty < 3);

  return (
    <div className="d-flex">
      <ManagerHeader />
      
      <div className="container-fluid p-0" style={{ marginLeft: '16rem' }}>
        <div className="p-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="fw-bold text-primary" data-aos="fade-right">
                <i className="fas fa-chart-bar me-2"></i>Inventory Summary
              </h1>
              <GeneratePDF calculateSummary={calculateSummary} />
            </div>

            {/* Quick Stats Section */}
            <div className="row g-3 mb-4">
              <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
                <div className="card border-0 shadow-sm h-100 bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-boxes me-2"></i>Total Items
                    </h5>
                    <h2 className="mt-3 mb-0">{items.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
                <div className="card border-0 shadow-sm h-100 bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-dollar-sign me-2"></i>Total Profit
                    </h5>
                    <h2 className="mt-3 mb-0">LKR {totalProfit.toFixed(2)}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
                <div className="card border-0 shadow-sm h-100 bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-tag me-2"></i>Total Cost
                    </h5>
                    <h2 className="mt-3 mb-0">LKR {totalCost.toFixed(2)}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3" data-aos="fade-up" data-aos-delay="400">
                <div className="card border-0 shadow-sm h-100 bg-danger text-white">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-exclamation-triangle me-2"></i>Low Stock
                    </h5>
                    <h2 className="mt-3 mb-0">{lowStockItems.length}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Main Category Section - No Accordions */}
              <div className="col-lg-8" data-aos="fade-right">
                {Object.keys(summary).map((category, index) => (
                  <motion.div 
                    key={category}
                    className="card border-0 shadow-sm mb-4"
                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-header bg-white py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-folder me-2 text-primary"></i>
                          {category}
                        </h5>
                        <span className="badge bg-primary rounded-pill">{summary[category].items.length} items</span>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Item Name</th>
                              <th>Qty</th>
                              <th>Buy Price</th>
                              <th>Sell Price</th>
                              <th>Total Cost</th>
                              <th>Profit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {summary[category].items.map((item, i) => (
                              <tr key={i} className={item.qty < 3 ? 'table-danger' : ''}>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>{item.buyingPrice.toFixed(2)}</td>
                                <td>{item.price.toFixed(2)}</td>
                                <td>{item.total.toFixed(2)}</td>
                                <td>{item.profit.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <td colSpan="4" className="text-end fw-bold">Category Totals:</td>
                              <td className="fw-bold">{summary[category].categoryTotal.toFixed(2)}</td>
                              <td className="fw-bold">{summary[category].categoryProfit.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right Sidebar */}
              <div className="col-lg-4" data-aos="fade-left">
                <div className="row g-4">
                  {/* Low Stock Alert */}
                  <div className="col-12">
                    <motion.div 
                      className="card border-0 shadow-sm"
                      whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    >
                      <div className="card-header bg-danger text-white py-3">
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-exclamation-circle me-2"></i>
                          Low Stock Alert
                        </h5>
                      </div>
                      <div className="card-body p-0">
                        {lowStockItems.length > 0 ? (
                          <ul className="list-group list-group-flush">
                            {lowStockItems.map((item) => (
                              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{item.name}</span>
                                <span className="badge bg-danger rounded-pill">Qty: {item.qty}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-muted">
                            <i className="fas fa-check-circle fa-2x mb-3"></i>
                            <p>No low stock items found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Category Summary */}
                  <div className="col-12">
                    <motion.div 
                      className="card border-0 shadow-sm"
                      whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    >
                      <div className="card-header bg-primary text-white py-3">
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-chart-pie me-2"></i>
                          Category Summary
                        </h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Items</th>
                              <th>Profit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(summary).map((category) => (
                              <tr key={category}>
                                <td>{category}</td>
                                <td>{summary[category].items.length}</td>
                                <td>{summary[category].categoryProfit.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummaryReport;