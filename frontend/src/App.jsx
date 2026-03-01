import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Closet from './pages/Closet';
import Accessories from './pages/Accessories';
import Laundry from './pages/Laundry';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import OutfitMaker from './pages/OutfitMaker';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="closet" element={<Closet />} />
                    <Route path="accessories" element={<Accessories />} />
                    <Route path="outfits" element={<OutfitMaker />} />
                    <Route path="laundry" element={<Laundry />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
