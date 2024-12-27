import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConfig } from '../services/configService';
import PostsTab from '../components/GlobalTabs/PostsTab';
import UserTab from '../components/GlobalTabs/UserTab';
import ConfigTab from "../components/GlobalTabs/ConfigTab";
import AdminManagementTab from '../components/GlobalTabs/AdminManagementTab'; // Import the new Admin Management Tab
import '../css/Dashboard.css';

const Dashboard = () => {
    const [configData, setConfigData] = useState(null);
    const [activeGlobalTab, setActiveGlobalTab] = useState('posts'); // Default to 'Posts' tab
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role'); // Get the user's role from localStorage

    useEffect(() => {
        // Fetch config data when the dashboard loads
        const loadConfig = async () => {
            try {
                const data = await fetchConfig();
                setConfigData(data);
            } catch (error) {
                console.error('Failed to load config:', error);
            }
        };
        loadConfig();
    }, []);

    // Handle sign-out functionality
    const handleSignOut = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('appUserId');
        localStorage.removeItem('role');
        navigate('/');
    };

    // Render global tab content
    const renderGlobalTab = () => {
        switch (activeGlobalTab) {
            case 'posts':
                return <PostsTab configData={configData} />;
            case 'sanghPosts':
                return <PostsTab configData={configData} />;    
            case 'user':
                return <UserTab />;
            case 'config':
                return <ConfigTab configData={configData} setConfigData = {setConfigData}/>;
            case 'admin':
                return userRole === 'SUPER_ADMIN' ? <AdminManagementTab /> : null;
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <h2>Poster Dashboard</h2>
                <button className="signout-btn" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>

            <div className="global-tabs">
                <button
                    className={`tab-item ${activeGlobalTab === 'sanghPosts' ? 'active-tab' : ''}`}
                    onClick={() => setActiveGlobalTab('sanghPosts')}
                >
                    Sangh Posts
                </button>
                <button
                    className={`tab-item ${activeGlobalTab === 'posts' ? 'active-tab' : ''}`}
                    onClick={() => setActiveGlobalTab('posts')}
                >
                    Posts
                </button>
                <button
                    className={`tab-item ${activeGlobalTab === 'user' ? 'active-tab' : ''}`}
                    onClick={() => setActiveGlobalTab('user')}
                >
                    User
                </button>
                <button
                    className={`tab-item ${activeGlobalTab === 'config' ? 'active-tab' : ''}`}
                    onClick={() => setActiveGlobalTab('config')}
                >
                    Config
                </button>
                {userRole === 'SUPER_ADMIN' && (
                    <button
                        className={`tab-item ${activeGlobalTab === 'admin' ? 'active-tab' : ''}`}
                        onClick={() => setActiveGlobalTab('admin')}
                    >
                        Admin Management
                    </button>
                )}
            </div>

            <div className="tab-content">
                {renderGlobalTab()}
            </div>
        </div>
    );
};

export default Dashboard;
