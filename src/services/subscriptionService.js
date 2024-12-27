import apiService from './apiService'; // Assuming apiService is already handling base API calls and headers

// API call to migrate a user subscription
export const migrateUserSubscription = async (email, packageName) => {
    try {
        const response = await apiService.put('/subscription/v1/migrate-subscription', null, {
            params: { emailId: email, packageName },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// API call to create a free premium subscription
export const createFreeSubscription = async (email, premiumTill) => {
    try {
        const response = await apiService.post('/subscription/v1/free', null, {
            params: { emailId: email, premiumTill },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
