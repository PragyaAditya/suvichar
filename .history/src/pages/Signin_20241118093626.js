import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../css/Signin.css'; // Import the CSS file

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    // Check if the user is already signed in
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            navigate('/dashboard'); // Redirect to dashboard if the user is signed in
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if (result.success) {
            navigate('/dashboard'); // Redirect to the dashboard after login
        } else {
            setError(result.message); // Set error message
            navigate('/dashboard');
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-box">
                <h2>Admin Sign In</h2>
                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signin-btn">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Signin;
