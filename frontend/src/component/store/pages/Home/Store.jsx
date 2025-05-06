import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Notification from "../../components/Notification";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { CartContext } from "../../utils/CartContext";

function Store() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { cartItems, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/inventory-items");
        setItems(response.data);

        const uniqueCategories = [
          ...new Set(
            response.data
              .filter((item) => item.category && item.category.name)
              .map((item) => item.category.name)
          ),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || (item.category && item.category.name === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (item) => {
    if (item.qty > 0) {
      const itemInCart = cartItems.find((cartItem) => cartItem._id === item._id);
      if (itemInCart) {
        if (itemInCart.quantity < item.qty) {
          addToCart(item);
          setNotification(`Added 1 more ${item.name} to your cart!`);
        } else {
          setNotification(`Cannot add more than ${item.qty} of ${item.name} to the cart.`);
        }
      } else {
        addToCart(item);
        setNotification(`${item.name} added to your cart!`);
      }
    } else {
      setNotification("This item is out of stock.");
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <AnimatePresence>
        {notification && (
          <Notification message={notification} onClose={() => setNotification(null)} />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            <i className="bi bi-shield-fill-check text-primary me-2"></i>
            Paw PetCare
          </Link>

          <div className="d-flex order-lg-2">
            <Link to="/cart" className="btn btn-outline-primary position-relative me-2">
              <i className="bi bi-cart3"></i>
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <Link to="/my-orders" className="btn btn-outline-primary me-2">
              <i className="bi bi-person"></i>
            </Link>
            <Link to="/logout" className="btn btn-primary d-none d-md-block">
              Logout
            </Link>
            <button
              className="navbar-toggler ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="input-group my-3 my-lg-0 mx-lg-auto" style={{ maxWidth: "500px" }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control border-end-0"
              />
              <span className="input-group-text bg-white border-start-0">
                <i className="bi bi-search"></i>
              </span>
            </div>
            <Link to="/logout" className="btn btn-primary mt-3 d-lg-none">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        {/* Page Title */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="fw-bold mb-2">Premium Pet Care Products</h1>
          <p className="text-muted">Quality essentials for your furry companions</p>
        </motion.div>

        {/* Filters */}
        <div className="row mb-4 g-3 align-items-center">
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2">
              <select
                className="form-select"
                style={{ maxWidth: "200px" }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ maxWidth: "200px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
          <div className="col-md-5 text-md-end">
            <p className="mb-0">
              <i className="bi bi-tag-fill me-2"></i>
              <span className="fw-medium">{filteredAndSortedItems.length}</span> products found
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Loading products...</p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search display-1 text-muted"></i>
            <h3 className="mt-3">No products found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredAndSortedItems.map((item, index) => (
              <div key={item._id} className="col-sm-6 col-md-4 col-lg-3">
                <motion.div
                  className="card h-100 border-0 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="position-relative card-img-wrapper">
                    <Link to={`/store-items/${item._id}`}>
                      <img
                        src={`data:image/jpeg;base64,${item.photo}`}
                        alt={item.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Link>
                    {item.qty <= 2 && item.qty > 0 && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-warning">
                        Low Stock
                      </span>
                    )}
                    {item.qty === 0 && (
                      <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                        Out of Stock
                      </span>
                    )}
                    {item.category && (
                      <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title mb-1">
                      <Link to={`/store-items/${item._id}`} className="text-decoration-none text-dark">
                        {item.name}
                      </Link>
                    </h5>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold fs-5">Rs.{item.price.toFixed(0)}</span>
                      {item.qty > 0 ? (
                        <span className="text-success small">
                          <i className="bi bi-check-circle me-1"></i>In Stock
                        </span>
                      ) : (
                        <span className="text-danger small">
                          <i className="bi bi-x-circle me-1"></i>Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="progress flex-grow-1" style={{ height: "8px" }}>
                        <div
                          className={`progress-bar ${
                            item.qty === 0 ? "bg-danger" : item.qty <= 2 ? "bg-warning" : "bg-success"
                          }`}
                          role="progressbar"
                          style={{ width: `${Math.min((item.qty / 10) * 100, 100)}%` }}
                          aria-valuenow={item.qty}
                          aria-valuemin="0"
                          aria-valuemax="10"
                        ></div>
                      </div>
                      <span className="badge bg-light text-dark ms-2 border">{item.qty} left</span>
                    </div>

                    <p className="card-text small text-muted mb-3">
                      {item.description && item.description.length > 70
                        ? `${item.description.substring(0, 70)}...`
                        : item.description || "High-quality product for your pet."}
                    </p>
                    <button
                      className={`btn w-100 ${item.qty === 0 ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => handleAddToCart(item)}
                      disabled={item.qty === 0}
                    >
                      {item.qty === 0 ? (
                        <>
                          <i className="bi bi-x-circle me-2"></i>Out of Stock
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;
