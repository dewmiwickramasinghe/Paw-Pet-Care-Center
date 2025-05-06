import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryCode: '',
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    if (!category.categoryCode?.trim()) errors.categoryCode = 'Category code is required';
    if (!category.name?.trim()) errors.name = 'Name is required';
    if (category.name?.length < 3) errors.name = 'Name must be at least 3 characters';
    if (!category.description?.trim()) errors.description = 'Description is required';
    if (category.description?.length < 10) errors.description = 'Description should be at least 10 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear the error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/categories/${id}`, category);
      setSuccess('Category updated successfully!');
      setTimeout(() => {
        navigate(`/categories/${id}`);
      }, 1500);
    } catch (error) {
      setError('Failed to update category. Please try again.');
      console.error('Error updating category:', error);
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
                <i className="fas fa-edit me-2"></i>Update Category
              </h1>
              <motion.button
                className="btn btn-outline-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/categories/${id}`)}
                data-aos="fade-left"
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Category
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

            {success && (
              <motion.div 
                className="alert alert-success text-center mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                data-aos="fade-down"
              >
                <i className="fas fa-check-circle me-2"></i>
                {success}
              </motion.div>
            )}

            <motion.div 
              className="card border-0 shadow-sm overflow-hidden"
              whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              data-aos="zoom-in"
            >
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-folder-open me-2"></i>
                  Category Information
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3" data-aos="fade-right" data-aos-delay="100">
                      <label htmlFor="categoryCode" className="form-label fw-semibold mb-1">
                        <i className="fas fa-hashtag me-1 text-primary"></i> Category Code
                      </label>
                      <input
                        type="text"
                        id="categoryCode"
                        name="categoryCode"
                        value={category.categoryCode}
                        onChange={handleChange}
                        className={`form-control ${formErrors.categoryCode ? 'is-invalid' : ''}`}
                        placeholder="Enter category code"
                        required
                      />
                      {formErrors.categoryCode && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {formErrors.categoryCode}
                        </div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3" data-aos="fade-left" data-aos-delay="200">
                      <label htmlFor="name" className="form-label fw-semibold mb-1">
                        <i className="fas fa-tag me-1 text-primary"></i> Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter category name"
                        required
                        onKeyDown={(e) => {
                          const regex = /^[A-Za-z\s]*$/; // Allow only letters and spaces
                          if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                            e.preventDefault(); // Prevent entering anything other than letters or spaces
                          }
                        }}
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {formErrors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3" data-aos="fade-up" data-aos-delay="300">
                    <label htmlFor="description" className="form-label fw-semibold mb-1">
                      <i className="fas fa-align-left me-1 text-primary"></i> Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={category.description}
                      onChange={handleChange}
                      className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                      rows="4"
                      placeholder="Enter category description"
                      required
                    ></textarea>
                    {formErrors.description && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {formErrors.description}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4" data-aos="fade-up" data-aos-delay="400">
                    <motion.button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/categories/${id}`)}
                    >
                      <i className="fas fa-times me-2"></i>Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-save me-2"></i>Update Category
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;