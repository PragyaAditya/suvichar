import React, {useState} from "react";
import '../../css/Dashboard.css';
import {createAdmin} from "../../services/adminService";

const NewAdminTab = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [createErrorMessage, setCreateErrorMessage] = useState('');
    const [createErrorCode, setCreateErrorCode] = useState('');
    const [createSuccessMessage, setCreateSuccessMessage] = useState('');

    const handleCreateAdmin = async () => {
        setCreateErrorMessage('');
        setCreateErrorCode('');
        setCreateSuccessMessage('');

        if (!username || !password) {
            setCreateErrorMessage('Please provide both username and password.');
            return;
        }

        try {
            const response = await createAdmin(username, password);
            if (response.success) {
                setCreateSuccessMessage('User created successfully.');
            } else if (response.error && response.error.length > 0) {
                setCreateErrorMessage(response.error[0].message);
                setCreateErrorCode(response.error[0].errorCode);
            } else {
                setCreateErrorMessage('Error with the API call.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error.length > 0) {
                const firstError = error.response.data.error[0];
                setCreateErrorMessage(firstError.message);
                setCreateErrorCode(firstError.errorCode);
            } else {
                setCreateErrorMessage('Error with the API call.');
            }
        }
    };

    return (
        <div className="subscription-management-tab">

            <div className="migrate-section">
                <h3>Create New Admin</h3>
                <div className="form-group">
                    <label htmlFor="migrateEmailInput">Enter User Id:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="packageNameInput">Enter Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button className="button" onClick={handleCreateAdmin}>
                    Create Admin
                </button>

                {/* Migrate Success/Error Messages */}
                {createSuccessMessage && <p className="success-message">{createSuccessMessage}</p>}
                {createErrorMessage && (
                    <div className="error-message">
                        {createErrorCode && <p>Error Code: {createErrorCode}</p>}
                        <p>{createErrorMessage}</p>
                    </div>
                )}
            </div>

        </div>
    );

};
export default NewAdminTab;