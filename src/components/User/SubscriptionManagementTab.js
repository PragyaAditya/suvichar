import React, { useState } from 'react';
import { migrateUserSubscription, createFreeSubscription } from '../../services/subscriptionService';
import '../../css/User/SubscriptionManagementTab.css';

const SubscriptionManagementTab = () => {
    // State for managing migration
    const [migrateEmail, setMigrateEmail] = useState('');
    const [packageName, setPackageName] = useState('');
    const [migrateErrorMessage, setMigrateErrorMessage] = useState('');
    const [migrateErrorCode, setMigrateErrorCode] = useState('');
    const [migrateSuccessMessage, setMigrateSuccessMessage] = useState('');

    // State for managing premium subscription
    const [premiumEmail, setPremiumEmail] = useState('');
    const [premiumDate, setPremiumDate] = useState('');
    const [premiumErrorMessage, setPremiumErrorMessage] = useState('');
    const [premiumErrorCode, setPremiumErrorCode] = useState('');
    const [premiumSuccessMessage, setPremiumSuccessMessage] = useState('');

    // Handle migrating user
    const handleMigrateUser = async () => {
        setMigrateErrorMessage('');
        setMigrateErrorCode('');
        setMigrateSuccessMessage('');

        if (!migrateEmail || !packageName) {
            setMigrateErrorMessage('Please provide both email and package name.');
            return;
        }

        try {
            const response = await migrateUserSubscription(migrateEmail, packageName);
            console.log(response);
            if (response.success) {
                setMigrateSuccessMessage('User migrated successfully.');
            } else if (response.error && response.error.length > 0) {
                setMigrateErrorMessage(response.error[0].message);
                setMigrateErrorCode(response.error[0].errorCode);
            } else {
                setMigrateErrorMessage('Error with the API call.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error.length > 0) {
                const firstError = error.response.data.error[0];
                setMigrateErrorMessage(firstError.message);
                setMigrateErrorCode(firstError.errorCode);
            } else {
                setMigrateErrorMessage('Error with the API call.');
            }
        }
    };

    // Handle making user premium
    const handleMakeUserPremium = async () => {
        setPremiumErrorMessage('');
        setPremiumErrorCode('');
        setPremiumSuccessMessage('');

        if (!premiumDate) {
            setPremiumErrorMessage('Please select a date.');
            return;
        }
        const premiumTillEpoch = new Date(premiumDate).getTime();
        try {
            const response = await createFreeSubscription(premiumEmail, premiumTillEpoch);
            if (response.success) {
                setPremiumSuccessMessage('User is now premium until ' + new Date(premiumDate).toLocaleDateString());
            } else if (response.error && response.error.length > 0) {
                setPremiumErrorMessage(response.error[0].message);
                setPremiumErrorCode(response.error[0].errorCode);
            } else {
                setPremiumErrorMessage('Error with the API call.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error.length > 0) {
                const firstError = error.response.data.error[0];
                setPremiumErrorMessage(firstError.message);
                setPremiumErrorCode(firstError.errorCode);
            } else {
                setPremiumErrorMessage('Error with the API call.');
            }
        }
    };

    return (
        <div className="subscription-management-tab">
            <h2>Subscription Management</h2>

            {/* Make User Premium Section */}
            <div className="premium-section">
                <h3>Make User Premium</h3>
                <div className="form-group">
                    <label htmlFor="premiumEmailInput">Enter User Email ID:</label>
                    <input
                        type="email"
                        id="premiumEmailInput"
                        value={premiumEmail}
                        onChange={(e) => setPremiumEmail(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="premiumDateInput">Select Premium Expiry Date:</label>
                    <input
                        type="date"
                        id="premiumDateInput"
                        value={premiumDate}
                        onChange={(e) => setPremiumDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button className="button" onClick={handleMakeUserPremium}>
                    Make User Premium
                </button>

                {/* Premium Success/Error Messages */}
                {premiumSuccessMessage && <p className="success-message">{premiumSuccessMessage}</p>}
                {premiumErrorMessage && (
                    <div className="error-message">
                        {premiumErrorCode && <p>Error Code: {premiumErrorCode}</p>}
                        <p>{premiumErrorMessage}</p>
                    </div>
                )}
            </div>

            <hr />

            {/* Migrate User Section */}
            <div className="migrate-section">
                <h3>Migrate User</h3>
                <div className="form-group">
                    <label htmlFor="migrateEmailInput">Enter User Email ID:</label>
                    <input
                        type="email"
                        id="migrateEmailInput"
                        value={migrateEmail}
                        onChange={(e) => setMigrateEmail(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="packageNameInput">Enter Package Name:</label>
                    <input
                        type="text"
                        id="packageNameInput"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button className="button" onClick={handleMigrateUser}>
                    Migrate User
                </button>

                {/* Migrate Success/Error Messages */}
                {migrateSuccessMessage && <p className="success-message">{migrateSuccessMessage}</p>}
                {migrateErrorMessage && (
                    <div className="error-message">
                        {migrateErrorCode && <p>Error Code: {migrateErrorCode}</p>}
                        <p>{migrateErrorMessage}</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default SubscriptionManagementTab;
