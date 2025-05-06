import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';
import axios from 'axios';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AddCategoryForm = () => {
  const [categoryCode, setCategoryCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!categoryCode.trim()) newErrors.categoryCode = 'Category code is required';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (description.length < 10) newErrors.description = 'Description should be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:5000/categories', {
        categoryCode,
        name,
        description,
      });
      
      // Set success message
      setStatusMessage('Category added successfully!');
      setTimeout(() => {
        navigate('/dashboard/catagory');
      }, 1500);
      
      // Reset form
      setCategoryCode('');
      setName('');
      setDescription('');
      setErrors({});
    } catch (error) {
      console.error('Error adding category:', error);
      setStatusMessage('Failed to add category. Please try again.');
    }
  };

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
                <i className="fas fa-plus-circle me-2"></i>Add New Category
              </h1>
              
            </div>

            {statusMessage && (
              <motion.div 
                className={`alert ${statusMessage.includes('success') ? 'alert-success' : 'alert-danger'} text-center mb-4`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                data-aos="fade-down"
              >
                <i className={`fas ${statusMessage.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                {statusMessage}
              </motion.div>
            )}

            <motion.div 
              className="card border-0 shadow-sm overflow-hidden"
              whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              data-aos="zoom-in"
            >
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-folder-plus me-2"></i>
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
                        value={categoryCode}
                        onChange={(e) => {
                          setCategoryCode(e.target.value);
                          if (errors.categoryCode) {
                            setErrors({...errors, categoryCode: ''});
                          }
                        }}
                        className={`form-control ${errors.categoryCode ? 'is-invalid' : ''}`}
                        placeholder="Enter category code"
                        required
                      />
                      {errors.categoryCode && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.categoryCode}
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
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors({...errors, name: ''});
                          }
                        }}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter category name"
                        required
                        onKeyDown={(e) => {
                          const regex = /^[A-Za-z\s]*$/;
                          if (!regex.test(e.key) && e.key !== "Backspace" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.name}
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
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors({...errors, description: ''});
                        }
                      }}
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows="4"
                      placeholder="Enter category description"
                      required
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-end mt-4" data-aos="fade-up" data-aos-delay="400">
                    
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-plus-circle me-2"></i>Add Category
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

export default AddCategoryForm;