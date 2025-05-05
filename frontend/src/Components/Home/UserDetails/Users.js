import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Users.css';  // Make sure to define button styles in your CSS

function UserList() {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleEdit = (user) => {
    setEditedUser(user);
    setPassword('');
    setConfirmPassword('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdatePassword = (id) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    axios.put(`http://localhost:5000/users/${id}`, { password })
      .then(response => {
        fetchUsers();
      })
      .catch(error => {
        console.error('Error updating password:', error);
      });
  };

  return (
    <div>
      <h1>User List</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Username</th>
            <th>Password</th>
            <th>Confirm Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.phoneNumber || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
                <td>{user.username || "N/A"}</td>
                <td>
                  {editedUser._id === user._id ? (
                    <input type="password" value={password} onChange={handlePasswordChange} />
                  ) : (
                    '******'
                  )}
                </td>
                <td>
                  {editedUser._id === user._id ? (
                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                  ) : (
                    '******'
                  )}
                </td>
                <td>
                  {editedUser._id === user._id ? (
                    <>
                      <button className="update-button" onClick={() => handleUpdatePassword(user._id)}>Save Password</button>
                      <button className="cancel-button" onClick={() => setEditedUser({})}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <Link to={`/userdetails/${user._id}`}>
                        <button className="update-button">Update</button>
                      </Link>
                      <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
                      <button className="edit-button" onClick={() => handleEdit(user)}>Edit Password</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
