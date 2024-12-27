import React, { useState } from 'react';
import UserManagementTab from '../User/UserManagementTab'; // Import the UserManagementTab
import SubscriptionManagementTab from '../User/SubscriptionManagementTab'; // Placeholder for Subscription Management Tab
import '../../css/UserTab.css'; // Import any required CSS

const UserTab = () => {
    const [activeSubTab, setActiveSubTab] = useState('userManagement'); // Default to 'User Management'

    const renderSubTab = () => {
        switch (activeSubTab) {
            case 'userManagement':
                return <UserManagementTab />; // Render User Management Tab
            case 'subscriptionManagement':
                return <SubscriptionManagementTab />; // Placeholder for Subscription Management Tab
            default:
                return null;
        }
    };

    return (
        <div className="user-tab">
            {/* Sub-tabs for User Management and Subscription Management */}
            <div className="sub-tabs">
                <button
                    className={`tab-item ${activeSubTab === 'userManagement' ? 'active-tab' : ''}`}
                    onClick={() => setActiveSubTab('userManagement')}
                >
                    User Management
                </button>
                <button
                    className={`tab-item ${activeSubTab === 'subscriptionManagement' ? 'active-tab' : ''}`}
                    onClick={() => setActiveSubTab('subscriptionManagement')}
                >
                    Subscription Management
                </button>
            </div>

            {/* Render the content of the selected sub-tab */}
            <div className="tab-content">{renderSubTab()}</div>
        </div>
    );
};

export default UserTab;
