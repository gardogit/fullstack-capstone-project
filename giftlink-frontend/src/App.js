import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import HomePage from './components/HomePage/HomePage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import SearchPage from './components/SearchPage/SearchPage';
import Profile from './components/Profile/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
        <Navbar/>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/app" element={<MainPage />} />
            <Route path="/app/login" element={<LoginPage/>} />
            <Route path="/app/register" element={<RegisterPage />} />
            <Route path="/app/product/:productId" element={<DetailsPage/>} />
            <Route path="/app/search" element={<SearchPage/>} />
            <Route path="/app/profile" element={<Profile/>} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
