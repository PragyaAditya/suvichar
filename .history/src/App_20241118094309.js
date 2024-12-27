import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Signin from './pages/Signin';
//import ImageUpload from './pages/ImageUpload';
//import PostManagement from './pages/PostManagement';
//import ThirdTab from './pages/ThirdTab';
import Dashboard from './pages/Dashboard';
import {v4 as uuidv4} from 'uuid';
import ProtectedRoute from './components/ProtectedRoute';

const deviceIdKey = 'deviceId';

function initializeDeviceId() {
    let deviceId = localStorage.getItem(deviceIdKey);
    if (!deviceId) {
        deviceId = uuidv4(); // Generate UUID
        localStorage.setItem(deviceIdKey, deviceId); // Store in localStorage
    }
}

initializeDeviceId(); // Call when the app initializes


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signin/>}/>
                <Route
                    path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
                {/* Redirect if no route matches */}
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
}

export default App;
