// src/pages/EmergencyCare.js
import React from 'react';
import './EmergencyCare.css';  // Importing the CSS file for styling

function EmergencyCare() {
  return (
    <div className="emergency-care-page">
      <h1>Emergency Care for Your Pet</h1>
      <p>
        At Paw Pet Care, we understand that pet emergencies can happen at any time. Our emergency care services are available to provide immediate treatment and care for your pets during urgent situations. Whether it’s a sudden illness, injury, or accident, our skilled veterinary team is ready to assist you with fast and effective care.
      </p>

      <h2>Emergency Services We Offer:</h2>
      <p>
        Our clinic is equipped to handle a variety of emergency situations. We are committed to providing rapid and compassionate care for your pet in times of need. Our emergency services include, but are not limited to:
      </p>
      <ul>
        <li><strong>Trauma Care</strong> - For injuries due to accidents or falls.</li>
        <li><strong>Poisoning and Toxic Ingestion Treatment</strong> - Immediate care for ingestion of harmful substances.</li>
        <li><strong>Severe Infections</strong> - Rapid treatment for serious infections or conditions.</li>
        <li><strong>Breathing or Heart Emergencies</strong> - Treatment for issues like choking, respiratory distress, or heart attacks.</li>
        <li><strong>Emergency Surgeries</strong> - Life-saving surgical interventions for critical conditions.</li>
        <li><strong>Wound Care and Bandaging</strong> - Immediate care for cuts, abrasions, and wounds.</li>
      </ul>

      <h2>Why Choose Us?</h2>
      <p>
        - Experienced and compassionate emergency care team.<br/>
        - State-of-the-art medical equipment for diagnostics and treatment.<br/>
        - 24/7 availability for emergencies.<br/>
        - Fast response times to ensure the best care for your pet.<br/>
        - Comfortable environment for both pets and owners during high-stress situations.<br/>
      </p>

      <h2>Contact Us for Emergency Care</h2>
      <p>
        In case of an emergency, don't hesitate to contact us immediately. Our team is available 24/7 to help your pet when they need it the most.
      </p>

      <button className="cta-button">Contact Emergency Care</button>
    </div>
  );
}

export default EmergencyCare;
