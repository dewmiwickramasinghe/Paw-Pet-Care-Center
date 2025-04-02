import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';  // Import Login Component
import AddUser from './Components/AddUser/AddUser';
import Users from './Components/Home/UserDetails/Users';
import UpdateUser from './Components/UpdateUser/UpdateUser';
import AddPet from './Components/AddPet/AddPet';
import PetDetails from './Components/PetDetails/PetDetails'; // Ensure this path is correct
import PetList from './Components/PetList';
import UpdatePet from './Components/UpdatePet/UpdatePet';
import Profile from './Components/Profile/Profile';






function App() {
  return (
    <div>
      <Routes>
        {/* Define your main routes */}
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/login" element={<Login />} />  {/* Ensure login route */}
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userdetails" element={<Users />} />
        <Route path="/profile/:id" element={<UpdateUser />} />
        

        

        {/* AddPet route with and without ID */}
        <Route path="/addpet" element={<AddPet />} /> {/* For adding a new pet */}
        <Route path="/addpet/:id" element={<AddPet />} /> {/* For editing an existing pet */}

        {/* Pet Update route */}
        <Route path="/pets/:id" element={<UpdatePet />} />

        {/* Pet List route */}
        <Route path="/pets" element={<PetList />} /> {/* Corrected path for PetList */}
        

        {/* PetDetails route with parameter (for a specific pet) */}
        <Route path="/petdetails/:id" element={<PetDetails />} /> {/* Pet Details with dynamic pet ID */}
        <Route path="/profile/:id" element={<Profile />} />
        
      </Routes>
    </div>
  );
}

export default App;
