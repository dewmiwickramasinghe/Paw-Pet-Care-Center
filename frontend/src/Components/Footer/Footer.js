// Footer.js
import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css'; // Optional if you want footer-specific styles

function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container footer-content">
        <div className="footer-left">
          <h3>Paw Pet Care</h3>
          <p>Compassionate care for your furry companions. 24/7 Service.</p>
        </div>
        <div className="footer-right">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/crew">Meet Our Team</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Paw Pet Care. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
