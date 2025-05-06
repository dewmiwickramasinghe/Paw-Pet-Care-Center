import React, { useState } from 'react';

const Settings = () => {
  // Example state for user info and notification preference
  const [name, setName] = useState('Finance Manager');
  const [email, setEmail] = useState('finance@pawcare.com');
  const [notify, setNotify] = useState(true);

  // Example handler
  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved!');
  };

  return (
    <div style={{ padding: 32, maxWidth: 480 }}>
      <h2 style={{ color: '#1976d2', marginBottom: 24 }}>Settings</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 18 }}>
          <label><b>Name:</b></label><br />
          <input
            type="text"
            value={name}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label><b>Email:</b></label><br />
          <input
            type="email"
            value={email}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            <input
              type="checkbox"
              checked={notify}
              onChange={e => setNotify(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Enable email notifications
          </label>
        </div>
        <button
          type="submit"
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 4,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Save Settings
        </button>
      </form>
      <div style={{ marginTop: 40, color: '#666' }}>
        <hr />
        <p><b>Other Settings:</b></p>
        <ul>
          <li>Change password</li>
          <li>Set dashboard theme</li>
          <li>Export/import data</li>
          <li>Manage user roles</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
