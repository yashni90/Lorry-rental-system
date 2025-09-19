import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import TruckDetails from './pages/TruckDetails';
import Trucks from './pages/Trucks';
import AddBooking from './pages/AddBooking'
import AdminDashboard from './pages/AdminManagement'; // assuming this is the admin dashboard
import AddDrivers from './pages/AddDrivers';
import AllDrivers from './pages/AllDrivers';
import ManageDispatch from './pages/ManageDispatch';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import UserDashboard from './pages/UserDashboard';
import AllUsers from './pages/AllUsers';

function App() {

  const [ShowLogin,setShowLogin] = useState(false);
  const location = useLocation();

  // Paths where Navbar should NOT be shown
  const hideNavbarPaths = ['/admin', '/owner', '/adddriver', '/alldriver', '/managedispatch', '/user', '/my-bookings' , '/alluser'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/truck-details/:id' element={<TruckDetails/>}/>
        <Route path='/cars' element={<Trucks/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/addbooking' element={<AddBooking/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/adddriver' element={<AddDrivers/>}/>
         <Route path='/alldriver' element={<AllDrivers/>}/>
         <Route path='/managedispatch' element={<ManageDispatch/>}/>
         <Route path="/signup" element={<Signup />} />
         <Route path="/signin" element={<Signin />} />
         <Route path="/user" element={<UserDashboard />} />
         <Route path="/alluser" element={<AllUsers />} />
      </Routes>
    </>
  )
}

export default App
