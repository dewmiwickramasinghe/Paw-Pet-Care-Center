import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    fetchCategories();
  }, []);

  // FIX: Wrap filterCategories in useCallback
  const filterCategories = useCallback(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter(
      category =>
        category.name.toLowerCase().includes(query) ||
        category.categoryCode.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  // FIX: Add filterCategories to dependency array
  useEffect(() => {
    if (categories.length > 0) {
      filterCategories();
    }
  }, [searchQuery, categories, filterCategories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
      setFilteredCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch categories.');
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="d-flex">
        <ManagerHeader />
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ marginLeft: '16rem', height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
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
                <i className="fas fa-th-large me-2"></i>Categories
              </h1>
              <Link to="/dashboard/addcatagory" className="text-decoration-none">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-aos="fade-left"
                >
                  <i className="fas fa-plus-circle me-2"></i>Add Category
                </motion.button>
              </Link>
            </div>

            {error && (
              <motion.div 
                className="alert alert-danger text-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </motion.div>
            )}

            {/* Search and Stats */}
            <div className="row g-3 mb-4">
              <div className="col-md-8" data-aos="fade-up">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
                <div className="card border-0 shadow-sm bg-primary text-white">
                  <div className="card-body d-flex justify-content-between align-items-center py-2">
                    <h5 className="mb-0">Total Categories</h5>
                    <span className="fw-bold fs-5">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <motion.div 
              className="card border-0 shadow-sm overflow-hidden"
              whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              data-aos="zoom-in"
            >
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-list me-2 text-primary"></i>
                  All Categories
                </h5>
              </div>
              <div className="card-body p-0">
                {filteredCategories.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>
                            <i className="fas fa-hashtag me-1 text-primary"></i>
                            Code
                          </th>
                          <th>
                            <i className="fas fa-tag me-1 text-primary"></i>
                            Name
                          </th>
                          <th>
                            <i className="fas fa-align-left me-1 text-primary"></i>
                            Description
                          </th>
                          <th>
                            <i className="fas fa-calendar-plus me-1 text-primary"></i>
                            Created
                          </th>
                          <th>
                            <i className="fas fa-calendar-alt me-1 text-primary"></i>
                            Updated
                          </th>
                          <th className="text-center">
                            <i className="fas fa-cogs me-1 text-primary"></i>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((category, index) => (
                          <tr key={category._id} data-aos="fade-up" data-aos-delay={50 * (index % 10)}>
                            <td>{category.categoryCode}</td>
                            <td className="fw-semibold">{category.name}</td>
                            <td>
                              {category.description.length > 50 
                                ? `${category.description.substring(0, 50)}...` 
                                : category.description}
                            </td>
                            <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                            <td>{new Date(category.updatedAt).toLocaleDateString()}</td>
                            <td className="text-center">
                              <Link to={`/categories/${category._id}`} className="text-decoration-none">
                                <motion.button 
                                  className="btn btn-sm btn-primary"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <i className="fas fa-eye me-1"></i>
                                  View
                                </motion.button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 className="text-muted">No categories found</h4>
                    <p className="text-muted">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
