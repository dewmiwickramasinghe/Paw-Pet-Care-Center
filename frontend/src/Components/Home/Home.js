import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Nav from './Nav/Nav';
import ChatBot from '../ChatBot';
import Footer from '../Footer/Footer'; // ✅ Correct path
import { FaCommentDots } from 'react-icons/fa'; 
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <div className="App">
      <Nav />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <h1>Expert Care for Your Beloved Companion from Paw Pet Care</h1>
            <p className="hero-subtitle">Premium Veterinary Services</p>
            <div className="cta-container">
              <button className="cta-button primary">Appointment</button>
              <button className="cta-button secondary">Store</button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <h3>25+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Emergency Care</p>
            </div>
          </div>
        </div>
      </header>

     {/* Featured Services */}
     <section className="featured-services container">
        <h2 className="section-title">Comprehensive Care Solutions</h2>
        <div className="services-grid">
          <div className="service-card" onClick={() => navigate('/preventive-care')}>
            <div className="icon-container">
              <i className="fas fa-stethoscope"></i>
            </div>
            <h3>Preventive Care</h3>
            <p>Regular checkups and vaccinations tailored to your pet's needs</p>
          </div>
          <div className="service-card" onClick={() => navigate('/nutrition-planning')}>
            <div className="icon-container">
              <i className="fas fa-bone"></i>
              
            </div>
            <h3>Nutrition Planning</h3>
            <p>Custom dietary programs for optimal health and vitality</p>
          </div>
          <div className="service-card" onClick={() => navigate('/emergency-care')}>
            <div className="icon-container">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3>Emergency Care</h3>
            <p>24/7 critical care services with advanced medical equipment</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container about-grid">
          <div className="about-image">
            <img src="vet.jpg" alt="Our veterinary team" />
          </div>
          <div className="about-content">
            <h2 className="section-title">Why Choose Pethund?</h2>
            <p className="highlight-text">20+ Years of Compassionate Care</p>

            <ul className="features-list">
              <li>
                <i className="fas fa-check-circle"></i>
                AAHA-Accredited Facility
              </li>
              <li>
                <i className="fas fa-check-circle"></i>
                Fear-Free Certified Practitioners
              </li>
              <li>
                <i className="fas fa-check-circle"></i>
                State-of-the-Art Diagnostic Equipment
              </li>
            </ul>
            <button
              className="cta-button outline"
              onClick={() => navigate('/crew')}
            >
              Meet Our Team
            </button>
          </div>
        </div>
      </section>

      {/* ChatBot Icon */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <FaCommentDots size={60} color="white" />
      </div>

      {/* ChatBot Popup */}
      {isChatOpen && <ChatBot />}

      {/* Footer Section */}
      <Footer /> {/* ✅ Added Footer properly */}
    </div>
  );
}

export default Home;
