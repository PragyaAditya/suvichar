import React, { useState } from 'react';
import { getUserDetails, deleteUser } from '../../services/userService'; // Import the API call for user details and deletion
import '../../css/User/UserManagementTab.css'; // Ensure the appropriate CSS is added

const UserManagementTab = () => {
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    const handleFetchUserInfo = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setErrorCode('');
        try {
            const response = await getUserDetails(email);
            if (response.success) {
                setUserInfo(response.data);
            } else if (response.error && response.error.length > 0) {
                setErrorMessage(response.error[0].message);
                setErrorCode(response.error[0].errorCode);
            } else {
                setErrorMessage('Error with the API call.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error.length > 0) {
                const firstError = error.response.data.error[0];
                setErrorMessage(firstError.message);
                setErrorCode(firstError.errorCode);
            } else {
                setErrorMessage('Error with the API call.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (confirmationText !== 'CONFIRM') {
            alert('You must type CONFIRM to delete the user.');
            return;
        }
        setErrorMessage('');
        setErrorCode('');
        try {
            const response = await deleteUser(userInfo.user.email);
            if (response.success) {
                setUserInfo(null); // Clear user info after deletion
                alert('User deleted successfully.');
                setShowDeletePopup(false);
            } else if (response.error && response.error.length > 0) {
                setErrorMessage(response.error[0].message);
                setErrorCode(response.error[0].errorCode);
            } else {
                setErrorMessage('Error with the API call.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error.length > 0) {
                const firstError = error.response.data.error[0];
                setErrorMessage(firstError.message);
                setErrorCode(firstError.errorCode);
            } else {
                setErrorMessage('Error with the API call.');
            }
        }
    };

    // Function to format the premium expiry time in GMT+5:30
    const formatPremiumExpiry = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    };

    return (
        <div className="user-management-tab">
            <h2>User Management</h2>
            <div className="form-group">
                <label htmlFor="emailInput">Enter User Email ID:</label>
                <input
                    type="email"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                />
                <button className="button" onClick={handleFetchUserInfo} disabled={isLoading}>
                    {isLoading ? 'Fetching...' : 'Fetch User Info'}
                </button>
            </div>

            {/* Display error message */}
            {errorMessage && (
                <div>
                    {errorCode && <p className="error-message">Error Code: {errorCode}</p>}
                    <p className="error-message">{errorMessage}</p>
                </div>
            )}

            {/* Display user profile info in a card format */}
            {userInfo && (
                <div className="user-info-card">
                    <div className="profile-img-container">
                        <img
                            src={userInfo.user.profileImgUrl || 'https://api.dicebear.com/9.x/adventurer/svg?seed=Molly'}
                            alt="Profile"
                            className="profile-img"
                        />
                    </div>
                    <div className="profile-details">
                        <h3 className="profile-title">User Profile</h3>
                        <div className="profile-info">
                            <p><strong>Name:</strong> {userInfo.user.name}</p>
                            <p><strong>Email:</strong> {userInfo.user.email}</p>
                            <p><strong>Phone:</strong> {userInfo.user.number}</p>
                            <p><strong>Role:</strong> {userInfo.user.role}</p>
                            <p><strong>Premium User:</strong> {userInfo.premiumUser ? 'Yes' : 'No'}</p>
                            {userInfo.premiumUser && (
                                <p><strong>Premium Till:</strong> {formatPremiumExpiry(userInfo.premiumTill)}</p>
                            )}
                        </div>
                        <button className="button" onClick={() => setShowDeletePopup(true)}>
                            Delete User
                        </button>
                    </div>
                </div>
            )}

            {/* Delete confirmation popup */}
            {showDeletePopup && (
                <div className="delete-popup">
                    <div className="delete-popup-content">
                        <h3>Are you sure you want to delete this user?</h3>
                        <p>This action cannot be undone. Type CONFIRM to delete the user.</p>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="input-field"
                        />
                        <button className="button confirm-delete-btn" onClick={handleDeleteUser}>
                            Confirm Delete
                        </button>
                        <button className="button cancel-btn" onClick={() => setShowDeletePopup(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementTab;
