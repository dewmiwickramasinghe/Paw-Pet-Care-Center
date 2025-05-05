// Button.js
import React from 'react';
import './Button.css';  // Import the button styling

function Button({ onClick, text, style }) {
  return (
    <button onClick={onClick} className="custom-button" style={style}>
      {text}
    </button>
  );
}

export default Button;
