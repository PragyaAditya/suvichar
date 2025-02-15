import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken'); // Check if JWT token exists

    if (!token) {
        // If no token, redirect to the sign-in page
        return <Navigate to="/"/>;
    }

    // If authenticated, render the children (protected components)
    return children;
};

export default ProtectedRoute;
