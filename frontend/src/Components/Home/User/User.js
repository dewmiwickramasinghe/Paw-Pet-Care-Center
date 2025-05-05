import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "./User";

function UserDetails() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Function to remove deleted user from state
  const handleDelete = (id) => {
    setUsers(users.filter(user => user._id !== id)); // Remove user from UI
  };

  return (
    <div>
      <h2>User List</h2>
      {users.map((user) => (
        <User key={user._id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default UserDetails;
