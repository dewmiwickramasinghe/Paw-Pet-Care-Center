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
import Profile from './Components/Profile/Profile';  // Import Profile Component
import 'font-awesome/css/font-awesome.min.css';
import { UserProvider } from './Components/Context/UserContext';  // Ensure correct path
import MyPets from './Components/MyPets/MyPet';
import PetProfile from './Components/PetProfile/PetProfile';
import Crew from './Components/Crew/Crew';
import FinancialDashboard from './Components/FinancialDashboard/FinancialDashboard'
import SellerDashboard from './Components/SellerDashboard/SellerDashboard'
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard'
import PreventiveCare from './Components/ExtraPages/PreventiveCare';
import NutritionPlanning from './Components/ExtraPages/NutritionPlanning';
import EmergencyCare from './Components/ExtraPages/EmergencyCare';



function App() {
  return (
    <UserProvider> {/* Wrap the entire app with UserProvider */}
      <div>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />  {/* Home route */}
          <Route path="/login" element={<Login />} />  {/* Login route */}
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/doctordashboard" element={<DoctorDashboard />} />
        <Route path="/financialdashboard" element={<FinancialDashboard />} />
        <Route path="/sellerdashboard" element={<SellerDashboard />} />
        
         
          
          <Route path="/my-pets/:userId" element={<MyPets />} />
          <Route path="/updatepet/:id" element={<UpdatePet />} />



          <Route path="/pets" element={<PetList />} /> 
          <Route path="/preventive-care" element={<PreventiveCare />} />
          <Route path="/nutrition-planning" element={<NutritionPlanning />} /> 
          <Route path="/emergency-care" element={<EmergencyCare />} />  {/* Route for Emergency Care page */}
          
          <Route path="/updateuser/:id" element={<UpdateUser />} />

          <Route path="/userdetails/:userId" element={<Profile />} />

          {/* AddPet route with and without ID */}
          <Route path="/addpet" element={<AddPet />} /> {/* For adding a new pet */}
          <Route path="/addpet/:id" element={<AddPet />} /> {/* For editing an existing pet */}

          {/* Pet Update route */}
          <Route path="/pets/:id" element={<UpdatePet />} />

          {/* Pet List route */}
          <Route path="/pets" element={<PetList />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          
          {/* PetDetails route with parameter (for a specific pet) */}
          <Route path="/petdetails/:id" element={<PetDetails />} />

          <Route path="/pet-profile/:petId" element={<PetProfile />} />

        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
