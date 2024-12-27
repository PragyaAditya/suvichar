import React, {useEffect, useState} from 'react';
import {changePassword, getAdmins, removeAdmin} from '../../services/adminService'; // Import necessary services
import '../../css/Admin/ManageAdminTab.css'

const ManageAdminTab = () => {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null); // For changing password
    const [newPassword, setNewPassword] = useState(''); // New password state
    const [showPasswordPopup, setShowPasswordPopup] = useState(false); // Password popup state
    const [showDeletePopup, setShowDeletePopup] = useState(false); // Delete popup state
    const [errorMessage, setErrorMessage] = useState(''); // State for displaying error messages

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const adminList = await getAdmins();
                setAdmins(adminList);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };
        fetchAdmins();
    }, []);

    const handleRemoveAdmin = async (adminId) => {
        if (window.confirm('Are you sure you want to remove this admin?')) {
            try {
                const removeAdminRes = await removeAdmin(adminId);
                if (removeAdminRes && removeAdminRes.success) {
                    setAdmins(admins.filter(admin => admin.userId !== adminId)); // Remove admin from the list
                } else {
                    setErrorMessage("Error Removing Admin")
                }
                setShowDeletePopup(false); // Close the popup
            } catch (error) {
                console.error('Error removing admin:', error);
                setErrorMessage('Error removing admin');
            }
        }
    };

    const handleChangePassword = async () => {
        try {
            const passChange = await changePassword(selectedAdmin.userId, newPassword); // Call API to change password
            if (passChange && passChange.success) {
                alert('Password updated successfully');
                setErrorMessage('')
            } else {
                setErrorMessage('Error updating password');
            }
            setShowPasswordPopup(false); // Close password popup
            setNewPassword(''); // Reset password input
        } catch (error) {
            console.error('Error changing password:', error);
            setErrorMessage('Error updating password');
        }
    };

    return (
        <div className="admin-management-tab">
            <h2>Manage Admins</h2>

            {/* Display admins */}
            <div className="admin-list">
                {admins.map((admin) => (
                    <div key={admin.userId} className="admin-card">
                        <div className="profile-img-container">
                            <img
                                src={admin.profileImgUrl || 'https://api.dicebear.com/9.x/adventurer/svg?seed=Molly'}
                                alt="Profile"
                                className="profile-img"
                            />
                        </div>
                        <div className="profile-details">
                            <h3>{admin.userId || 'Admin'}</h3>
                            <p><strong>Name:</strong> {admin.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {admin.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {admin.number || 'N/A'}</p>
                            <p><strong>Role:</strong> {admin.role}</p>
                            <button className="button" onClick={() => {
                                setSelectedAdmin(admin);
                                setShowDeletePopup(true);
                            }}>
                                Remove Admin
                            </button>
                            <button className="button" onClick={() => {
                                setSelectedAdmin(admin);
                                setShowPasswordPopup(true);
                            }}>
                                Change Password
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to remove this admin?</p>
                        <button className="button" onClick={() => handleRemoveAdmin(selectedAdmin.userId)}>Confirm
                        </button>
                        <button className="button" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Change Password Popup */}
            {showPasswordPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Change Password for {selectedAdmin?.name || 'Admin'}</h3>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button className="button" onClick={handleChangePassword}>Update Password</button>
                        <button className="button" onClick={() => setShowPasswordPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Display Error Message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ManageAdminTab;
