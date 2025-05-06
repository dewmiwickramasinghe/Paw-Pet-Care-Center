import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({});
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    const fetchItemDetails = async () => {
      try {
        // Fetch item details by ID
        const itemResponse = await axios.get(`http://localhost:5000/inventory-items/${id}`);
        if (!itemResponse.data) {
          throw new Error('Item not found');
        }
        setItem(itemResponse.data);
        setUpdatedItem(itemResponse.data);

        // Fetch available categories
        const categoriesResponse = await axios.get('http://localhost:5000/categories');
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item or category details:', error);
        setError('Error fetching item or category details. Please try again later.');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/inventory-items/${id}`);
        navigate('/dashboard/shashini');
      } catch (error) {
        setError('Error deleting item. Please try again.');
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!updatedItem.name) errors.name = 'Name is required';
    if (!updatedItem.price || updatedItem.price < 0) errors.price = 'Price must be a non-negative number';
    if (!updatedItem.qty || updatedItem.qty < 0) errors.qty = 'Quantity must be a non-negative number';
    if (!updatedItem.description) errors.description = 'Description is required';
    if (!updatedItem.companyName) errors.companyName = 'Company name is required';
    if (!updatedItem.category) errors.category = 'Category is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/inventory-items/${id}`, updatedItem);
      setItem(updatedItem); // Update local state
      setShowModal(false);
    } catch (error) {
      setError('Error updating item. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem({ ...updatedItem, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat._id === e.target.value);
    setUpdatedItem({ ...updatedItem, category: selectedCategory });
    setFormErrors({ ...formErrors, category: '' });
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

  if (error) {
    return (
      <div className="d-flex">
        <ManagerHeader />
        <div className="container-fluid" style={{ marginLeft: '16rem' }}>
          <div className="alert alert-danger text-center mt-4" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="d-flex">
      <ManagerHeader />
      
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="p-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold text-primary" data-aos="fade-right">
                <i className="fas fa-box me-2"></i>Item Details
              </h1>
              <div className="d-flex gap-2">
                <motion.button 
                  className="btn btn-outline-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard/shashini')}
                  data-aos="fade-left"
                >
                  <i className="fas fa-arrow-left me-2"></i>Back to Inventory
                </motion.button>
              </div>
            </div>

            <div className="row g-4">
              {/* Item Image */}
              <div className="col-lg-5" data-aos="fade-right">
                <motion.div 
                  className="card border-0 shadow-sm h-100"
                  whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  {item.photo ? (
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '400px' }}>
                      <img
                        src={`data:image/jpeg;base64,${item.photo}`}
                        alt={item.name}
                        className="img-fluid"
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '400px' }}>
                      <i className="fas fa-image fa-4x text-muted"></i>
                    </div>
                  )}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      {item.category && (
                        <span className="badge bg-primary">
                          <i className="fas fa-tag me-1"></i>
                          {item.category.name}
                        </span>
                      )}
                      <span className={`badge ${item.qty < 3 ? 'bg-danger' : 'bg-success'}`}>
                        <i className="fas fa-cubes me-1"></i>
                        Stock: {item.qty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Item Details */}
              <div className="col-lg-7" data-aos="fade-left">
                <motion.div 
                  className="card border-0 shadow-sm h-100"
                  whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="card-body p-4">
                    <h2 className="card-title fw-bold mb-3">{item.name}</h2>
                    
                    <div className="mb-4">
                      <h4 className="text-primary fw-bold">
                        LKR {item.price.toFixed(2)}
                      </h4>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-muted mb-2">
                        <i className="fas fa-info-circle me-2"></i>Description
                      </h6>
                      <p className="card-text">{item.description}</p>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6 className="text-muted mb-2">
                          <i className="fas fa-building me-2"></i>Company
                        </h6>
                        <p className="card-text">{item.companyName}</p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-muted mb-2">
                          <i className="fas fa-barcode me-2"></i>Product Code
                        </h6>
                        <p className="card-text">{item.code || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6 className="text-muted mb-2">
                          <i className="fas fa-tags me-2"></i>Buying Price
                        </h6>
                        <p className="card-text">LKR {item.buyingPrice?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-muted mb-2">
                          <i className="fas fa-dollar-sign me-2"></i>Selling Price
                        </h6>
                        <p className="card-text">LKR {item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <motion.button 
                        className="btn btn-warning text-dark"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                      >
                        <i className="fas fa-edit me-2"></i>Edit
                      </motion.button>
                      <motion.button 
                        className="btn btn-danger"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                      >
                        <i className="fas fa-trash-alt me-2"></i>Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
              <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <motion.div 
                    className="modal-content border-0 shadow-lg"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="modal-header bg-primary text-white">
                      <h5 className="modal-title">
                        <i className="fas fa-edit me-2"></i>
                        Edit Item
                      </h5>
                      <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body p-4">
                      <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">
                          <i className="fas fa-tag me-1 text-primary"></i> Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={updatedItem.name || ''}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            const regex = /^[A-Za-z\s]$/;
                            if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                              e.preventDefault();
                            }
                          }}
                          className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        />
                        {formErrors.name && (
                          <div className="invalid-feedback">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            {formErrors.name}
                          </div>
                        )}
                      </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="price" className="form-label fw-semibold">
                                <i className="fas fa-dollar-sign me-1 text-primary"></i> Price
                              </label>
                              <input
                                type="number"
                                id="price"
                                name="price"
                                value={updatedItem.price || ''}
                                onChange={handleInputChange}
                                className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                              />
                              {formErrors.price && (
                                <div className="invalid-feedback">
                                  <i className="fas fa-exclamation-circle me-1"></i>
                                  {formErrors.price}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label htmlFor="qty" className="form-label fw-semibold">
                                <i className="fas fa-boxes me-1 text-primary"></i> Quantity
                              </label>
                              <input
                                type="number"
                                id="qty"
                                name="qty"
                                value={updatedItem.qty || ''}
                                onChange={handleInputChange}
                                className={`form-control ${formErrors.qty ? 'is-invalid' : ''}`}
                              />
                              {formErrors.qty && (
                                <div className="invalid-feedback">
                                  <i className="fas fa-exclamation-circle me-1"></i>
                                  {formErrors.qty}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label fw-semibold">
                            <i className="fas fa-align-left me-1 text-primary"></i> Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={updatedItem.description || ''}
                            onChange={handleInputChange}
                            className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                          ></textarea>
                          {formErrors.description && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {formErrors.description}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="companyName" className="form-label fw-semibold">
                            <i className="fas fa-building me-1 text-primary"></i> Company
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={updatedItem.companyName || ''}
                            onChange={handleInputChange}
                            className={`form-control ${formErrors.companyName ? 'is-invalid' : ''}`}
                          />
                          {formErrors.companyName && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {formErrors.companyName}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="category" className="form-label fw-semibold">
                            <i className="fas fa-sitemap me-1 text-primary"></i> Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={updatedItem.category?._id || ''}
                            onChange={handleCategoryChange}
                            className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {formErrors.category && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {formErrors.category}
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <motion.button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(false)}
                      >
                        <i className="fas fa-times me-2"></i>Cancel
                      </motion.button>
                      <motion.button 
                        type="button" 
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpdate}
                      >
                        <i className="fas fa-save me-2"></i>Save Changes
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Modal Backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;