import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/categories/${id}`);
        setCategory(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch category details.');
        console.error('Error fetching category:', error);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      navigate('/dashboard/catagory');
    } catch (error) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', error);
      setDeleteConfirm(false);
    }
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
                <i className="fas fa-folder me-2"></i>Category Details
              </h1>
              <motion.button
                className="btn btn-outline-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/categories')}
                data-aos="fade-left"
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Categories
              </motion.button>
            </div>

            {error && (
              <motion.div 
                className="alert alert-danger text-center mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                data-aos="fade-down"
              >
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </motion.div>
            )}

            {category && (
              <div className="row g-4">
                <div className="col-lg-8" data-aos="fade-right">
                  <motion.div 
                    className="card border-0 shadow-sm overflow-hidden"
                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-header bg-primary text-white py-3">
                      <h5 className="mb-0 fw-bold">
                        <i className="fas fa-info-circle me-2"></i>
                        Category Information
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h6 className="text-muted mb-1">
                            <i className="fas fa-hashtag me-1 text-primary"></i> Category Code
                          </h6>
                          <p className="fs-5 fw-semibold">{category.categoryCode}</p>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-muted mb-1">
                            <i className="fas fa-tag me-1 text-primary"></i> Name
                          </h6>
                          <p className="fs-5 fw-semibold">{category.name}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="text-muted mb-1">
                          <i className="fas fa-align-left me-1 text-primary"></i> Description
                        </h6>
                        <p className="mb-0">{category.description}</p>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-muted mb-1">
                            <i className="fas fa-calendar-plus me-1 text-primary"></i> Created
                          </h6>
                          <p className="text-muted small">
                            {new Date(category.createdAt).toLocaleDateString()} at {new Date(category.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-muted mb-1">
                            <i className="fas fa-calendar-alt me-1 text-primary"></i> Last Updated
                          </h6>
                          <p className="text-muted small">
                            {new Date(category.updatedAt).toLocaleDateString()} at {new Date(category.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="col-lg-4" data-aos="fade-left">
                  <motion.div 
                    className="card border-0 shadow-sm overflow-hidden"
                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-header bg-white py-3">
                      <h5 className="mb-0 fw-bold">
                        <i className="fas fa-cogs me-2 text-primary"></i>
                        Actions
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-grid gap-2">
                        <motion.button
                          className="btn btn-warning"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/categories/${id}/edit`)}
                        >
                          <i className="fas fa-edit me-2"></i>
                          Edit Category
                        </motion.button>
                        {!deleteConfirm ? (
                          <motion.button
                            className="btn btn-outline-danger"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDeleteConfirm(true)}
                          >
                            <i className="fas fa-trash-alt me-2"></i>
                            Delete Category
                          </motion.button>
                        ) : (
                          <div className="card border-danger mt-3">
                            <div className="card-body text-center p-3">
                              <p className="mb-3">Are you sure you want to delete this category?</p>
                              <div className="d-flex justify-content-center gap-2">
                                <motion.button
                                  className="btn btn-sm btn-outline-secondary"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteConfirm(false)}
                                >
                                  Cancel
                                </motion.button>
                                <motion.button
                                  className="btn btn-sm btn-danger"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={handleDelete}
                                >
                                  Yes, Delete
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="card border-0 shadow-sm overflow-hidden mt-4"
                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  >
                    
                    
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;