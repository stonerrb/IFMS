import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Admindash from './components/admin-dash/Admin-dash';
import FloorRooms from './components/admin-dash/Floor-Rooms';
import Userdash from './components/user-dash/Userdash';
import History from './components/admin-dash/History';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dash" element={<Admindash />} />
          <Route path="/admin-dash/floor-rooms/:floorId" element={<FloorRooms />} />
          <Route path="/user-dash" element={<Userdash />} />
          <Route path="/admin-dash/floor-history/:floorId" element={<History />} />
         
        </Routes>
      </Router>
    </>
  )
}

export default App
