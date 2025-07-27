
import React, { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! 🐾 How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Chat is initially minimized

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Dummy bot responses
    let reply = 'Sorry, I didn’t get that. 😅';

    if (input.toLowerCase().includes('forgot password')) {
      reply = 'Oh no! 😢 Please contact us at support@yourapp.com to reset your password.';
    } else if (input.toLowerCase().includes('appointment')) {
      reply = 'To book an appointment, please visit the 🩺 Appointment page.';
    } else if (input.toLowerCase().includes('help')) {
      reply = 'I can help with Pet Care, Appointments, and more! 🐶';
    } else if (input.toLowerCase().includes('contact')) {
      reply = 'You can reach us at support@yourapp.com for any inquiries! 📧';
    } else if (input.toLowerCase().includes('services')) {
      reply = 'We offer Pet Care services,  much more! 🐕🐈';
    } else if (input.toLowerCase().includes('hello')) {
      reply = 'Hi there! How can I assist you today? 😄';
    } else if (input.toLowerCase().includes('payment')) {
      reply = 'For payment inquiries, please visit the Payments section on your account page. 💳';
    } else if (input.toLowerCase().includes('account')) {
      reply = 'You can manage your account settings by visiting the Account page. ⚙️';
    } else if (input.toLowerCase().includes('feedback')) {
      reply = 'We would love to hear your feedback! Please visit the Feedback page to share your thoughts. 💬';
    } else if (input.toLowerCase().includes('update')) {
      reply = 'To update your details, please go to the Profile page and make the changes there. 📝';
    } else if (input.toLowerCase().includes('terms')) {
      reply = 'You can read our terms and conditions on the Terms page. 📜';
    } else if (input.toLowerCase().includes('thank you')) {
      reply = 'You’re welcome! 😊 Let me know if you need anything else!';
    } else if (input.toLowerCase().includes('goodbye')) {
      reply = 'Goodbye! 🐾 I’m here if you need me again!';
    }

    setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    setInput('');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen); // Toggle open/close chat window
  };

  return (
    <div
      style={{
        ...styles.chatBox,
        height: isOpen ? '400px' : '50px', // Open/close chat window
        width: isOpen ? '300px' : '50px',  // Adjust width for minimized state
        borderRadius: isOpen ? '10px' : '50%', // Rounded when closed
        bottom: '20px',
        right: '20px',
      }}
    >
      {isOpen ? (
        <>
          <div style={styles.header}>
            💬 ChatBot Helper
            <button onClick={toggleChat} style={styles.closeButton}>-</button>
          </div>
          <div style={styles.chatArea}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#d1f7c4' : '#f1f1f1',
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} style={styles.button}>Send</button>
          </div>
        </>
      ) : (
        <div style={styles.icon} onClick={toggleChat}>🤖</div> // Robot icon when minimized
      )}
    </div>
  );
};

const styles = {
  chatBox: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'white',
    fontFamily: 'Arial',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'height 0.3s ease, width 0.3s ease', // Smooth transition for size change
  },
  header: {
    background: '#4CAF50',
    color: 'white',
    padding: '10px',
    fontWeight: 'bold',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
  },
  chatArea: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  message: {
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  inputArea: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    marginLeft: '5px',
    padding: '8px 12px',
    borderRadius: '5px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '30px', // Icon size
    cursor: 'pointer',
    textAlign: 'center',
  },
};

export default ChatBot;
