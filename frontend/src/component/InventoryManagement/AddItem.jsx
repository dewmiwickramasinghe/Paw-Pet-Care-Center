import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AddItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState({
    name: '',
    code: '',
    companyName: '',
    description: '',
    qty: 0,
    buyingPrice: 0,
    price: 0,
    category: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        setError('Failed to fetch categories.');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prev) => ({
        ...prev,
        photo: file,
      }));
      setErrors((prev) => ({ ...prev, photo: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!item.name.trim()) newErrors.name = 'Name is required';
    if (item.name.length < 3) newErrors.name = 'Name must be at least 3 characters long';
    if (!item.code.trim()) newErrors.code = 'Code is required';
    if (item.code.length < 3) newErrors.code = 'Code must be at least 3 characters long';
    if (!item.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!item.description.trim()) newErrors.description = 'Description is required';
    if (item.qty <= 0) newErrors.qty = 'Quantity must be greater than 0';
    if (item.buyingPrice <= 0) newErrors.buyingPrice = 'Buying Price must be greater than 0';
    if (item.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!item.category) newErrors.category = 'Please select a category';
    if (!item.photo) {
      newErrors.photo = 'Photo is required';
    } else if (item.photo.size > 1048576) {
      newErrors.photo = 'Photo size should not exceed 1MB';
    } else if (!/\.(jpg|jpeg|png)$/i.test(item.photo.name)) {
      newErrors.photo = 'Photo must be in JPG, JPEG, or PNG format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }

    try {
      await axios.post('http://localhost:5000/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Item added successfully!');
      navigate('/dashboard/shashini');
    } catch (error) {
      setError('Failed to add item.');
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content - Using more space efficiently */}
<div className="container-fluid p-0" style={{ marginLeft: '10rem', marginBottom: '-10rem' }}>
        <motion.div 
          className="p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 fw-bold text-primary text-center" data-aos="fade-down">
            <i className="fas fa-plus-circle me-2"></i>Add New Product
          </h1>

          {error && (
            <motion.div 
              className="alert alert-danger text-center mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div 
            className="card shadow-lg border-0 overflow-hidden"
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            data-aos="zoom-in"
          >
            <div className="card-header bg-primary bg-gradient text-white py-2">
              <h5 className="mb-0">
                <i className="fas fa-clipboard-list me-2"></i>
                Product Information
              </h5>
            </div>
            
            <div className="card-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Left column */}
                  <div className="col-lg-6" data-aos="fade-right" data-aos-delay="100">
                    <div className="mb-2">
                      <label htmlFor="name" className="form-label fw-semibold mb-1">
                        <i className="fas fa-tag me-1 text-primary"></i> Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={item.name}
                        onChange={(e) => {
                          const regex = /^[A-Za-z\s]*$/;
                          if (regex.test(e.target.value) || e.target.value === '') {
                            handleChange(e);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              name: '',
                            }));
                          } else {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              name: 'Name can only contain letters and spaces.',
                            }));
                          }
                        }}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter product name"
                        required
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="row g-2">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <label htmlFor="code" className="form-label fw-semibold mb-1">
                            <i className="fas fa-barcode me-1 text-primary"></i> Code
                          </label>
                          <input
                            type="text"
                            id="code"
                            name="code"
                            value={item.code}
                            onChange={handleChange}
                            className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                            placeholder="Enter code"
                            required
                          />
                          {errors.code && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {errors.code}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <label htmlFor="category" className="form-label fw-semibold mb-1">
                            <i className="fas fa-sitemap me-1 text-primary"></i> Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={item.category}
                            onChange={handleChange}
                            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {errors.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="companyName" className="form-label fw-semibold mb-1">
                        <i className="fas fa-building me-1 text-primary"></i> Company Name
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={item.companyName}
                        onChange={(e) => {
                          const regex = /^[A-Za-z\s&,'-]*$/;
                          if (regex.test(e.target.value) || e.target.value === '') {
                            handleChange(e);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              companyName: '',
                            }));
                          } else {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              companyName: 'Company name can only contain letters, spaces, and some special characters (&, \', -, ,)',
                            }));
                          }
                        }}
                        className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                        placeholder="Enter company name"
                        required
                      />
                      {errors.companyName && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.companyName}
                        </div>
                      )}
                    </div>

                    <div className="mb-2">
                      <label htmlFor="description" className="form-label fw-semibold mb-1">
                        <i className="fas fa-align-left me-1 text-primary"></i> Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={item.description}
                        onChange={handleChange}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows="3"
                        placeholder="Enter product description"
                        required
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
                    <div className="row g-2">
                      <div className="col-md-4">
                        <div className="mb-2">
                          <label htmlFor="qty" className="form-label fw-semibold mb-1">
                            <i className="fas fa-boxes me-1 text-primary"></i> Quantity
                          </label>
                          <input
                            type="number"
                            id="qty"
                            name="qty"
                            value={item.qty}
                            onChange={handleChange}
                            className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                            required
                          />
                          {errors.qty && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {errors.qty}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-2">
                          <label htmlFor="buyingPrice" className="form-label fw-semibold mb-1">
                            <i className="fas fa-tags me-1 text-primary"></i> Buy Price
                          </label>
                          <input
                            type="number"
                            id="buyingPrice"
                            name="buyingPrice"
                            value={item.buyingPrice}
                            onChange={handleChange}
                            className={`form-control ${errors.buyingPrice ? 'is-invalid' : ''}`}
                            required
                          />
                          {errors.buyingPrice && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {errors.buyingPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-2">
                          <label htmlFor="price" className="form-label fw-semibold mb-1">
                            <i className="fas fa-dollar-sign me-1 text-primary"></i> Sell Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={item.price}
                            onChange={handleChange}
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            required
                          />
                          {errors.price && (
                            <div className="invalid-feedback">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              {errors.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="photo" className="form-label fw-semibold mb-1">
                        <i className="fas fa-image me-1 text-primary"></i> Product Photo
                      </label>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                        required
                      />
                      {errors.photo && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.photo}
                        </div>
                      )}
                    </div>

                    {preview && (
                      <div className="mb-2" data-aos="zoom-in">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label className="form-label fw-semibold mb-0">
                            <i className="fas fa-eye me-1 text-primary"></i> Image Preview
                          </label>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setPreview(null);
                              setItem(prev => ({...prev, photo: null}));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <div className="text-center">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="img-thumbnail rounded shadow-sm" 
                            style={{ maxHeight: '180px', maxWidth: '100%' }} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <motion.button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard/shashini')}
                  >
                    <i className="fas fa-arrow-left me-1"></i>
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-plus-circle me-1"></i>
                    Add Item
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItemForm;