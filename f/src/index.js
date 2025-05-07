import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Error tracking
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Add global error handler
    const errorHandler = (event) => {
      console.error('Unhandled error:', event.error);
      setError(event.error);
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
        <details style={{ 
          whiteSpace: 'pre-wrap', 
          backgroundColor: '#f5f5f5',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <summary>Click to view error details</summary>
          <p>{error?.toString()}</p>
          <p>Stack trace:</p>
          <pre>{error?.stack}</pre>
        </details>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
