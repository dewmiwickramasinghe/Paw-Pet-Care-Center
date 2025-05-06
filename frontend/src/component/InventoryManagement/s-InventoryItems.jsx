import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SenuraInventoryItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory-items');
        setItems(response.data);
        setFilteredItems(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data
          .filter(item => item.category && item.category.name)
          .map(item => item.category.name))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterAndSortItems(query, selectedCategory, sortBy, sortOrder);
  };

  // Handle category filter
  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterAndSortItems(searchQuery, category, sortBy, sortOrder);
  };

  // Handle sorting
  const handleSort = (e) => {
    const value = e.target.value;
    const [newSortBy, newSortOrder] = value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    filterAndSortItems(searchQuery, selectedCategory, newSortBy, newSortOrder);
  };

  // Combined filter and sort function
  const filterAndSortItems = (query, category, sort, order) => {
    let filtered = [...items];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(item => 
        item.category && item.category.name === category
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch(sort) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'qty':
          valueA = a.qty;
          valueB = b.qty;
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }
      
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredItems(filtered);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold text-primary" data-aos="fade-right">
                <i className="fas fa-boxes me-2"></i>Inventory Items
              </h1>
              <Link to="/dashboard/additem" className="btn btn-primary" data-aos="fade-left">
                <i className="fas fa-plus-circle me-2"></i>Add New Item
              </Link>
            </div>

            {/* Filters Section */}
            <div className="card border-0 shadow-sm mb-4" data-aos="fade-up">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        placeholder="Search by name..."
                        className="form-control"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select" 
                      value={selectedCategory}
                      onChange={handleCategoryFilter}
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select" 
                      value={`${sortBy}-${sortOrder}`}
                      onChange={handleSort}
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="qty-asc">Quantity (Low to High)</option>
                      <option value="qty-desc">Quantity (High to Low)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Item Grid */}
            {filteredItems.length > 0 ? (
              <div className="row g-3">
                {filteredItems.map((item, index) => (
                  <div key={item._id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={100 + (index % 6) * 50}>
                    <motion.div 
                      className="card h-100 border-0 shadow-sm"
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    >
                      <Link to={`/items/${item._id}`} className="text-decoration-none">
                        <div className="position-relative">
                          {item.photo && (
                            <img
                              src={`data:image/jpeg;base64,${item.photo}`}
                              className="card-img-top"
                              alt={item.name}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                          {item.qty < 3 && (
                            <div className="position-absolute top-0 end-0 m-2">
                              <span className="badge bg-danger">Low Stock</span>
                            </div>
                          )}
                          {item.category && (
                            <div className="position-absolute top-0 start-0 m-2">
                              <span className="badge bg-primary">{item.category.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h5 className="card-title text-dark mb-2">{item.name}</h5>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold text-primary">LKR {item.price.toFixed(2)}</span>
                            <span className={`badge ${item.qty < 3 ? 'bg-danger' : 'bg-success'}`}>
                              Qty: {item.qty}
                            </span>
                          </div>
                          <p className="card-text text-muted small mb-1">
                            <i className="fas fa-building me-1"></i> {item.companyName}
                          </p>
                          <p className="card-text text-muted small mb-0 text-truncate">
                            <i className="fas fa-info-circle me-1"></i> {item.description}
                          </p>
                        </div>
                        <div className="card-footer bg-white border-0 p-3 pt-0">
                          <div className="d-grid">
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="fas fa-eye me-1"></i> View Details
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm p-5 text-center" data-aos="fade-up">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h3 className="text-muted">No items found</h3>
                <p className="text-muted">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SenuraInventoryItems;