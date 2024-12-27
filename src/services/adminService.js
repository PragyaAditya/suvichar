import apiClient from './apiService'; // Import apiService to make the API calls


export const getAdmins = async () => {
    try {
        const response = await apiClient.get('/user/v1/admin/admins', {});
        return response.data.users; // Return the data from the response
    } catch (error) {
        console.error('Error fetching admin details:', error);
        throw error;
    }
};

export const changePassword = async (userId, newPassword) => {
    try {
        const response = await apiClient.put('/user/v1/admin/password', null, {
            params: {
                userId: userId,
                password: newPassword
            }
        });

        if (response.data && response.data.success) {
            return {success: true, message: 'Password changed successfully.'};
        } else {
            return {success: false, message: response.data.message || 'Failed to change password.'};
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return {success: false, message: 'An error occurred while changing the password.'};
    }
};

export const removeAdmin = async (userId) => {
    try {
        const response = await apiClient.delete('/user/v1/admin', {
            params: {
                username: userId
            }
        });

        if (response.data && response.data.success) {
            return {success: true, message: 'Admin removed successfully.'};
        } else {
            return {success: false, message: response.data.message || 'Failed to remove admin.'};
        }
    } catch (error) {
        console.error('Error removing admin:', error);
        return {success: false, message: 'An error occurred while removing the admin.'};
    }
};

export const createAdmin = async (username, password) => {
    try {
        const payload = {
            username,
            password
        };
        const response = await apiClient.post('/user/v1/admin', payload);

        return response.data;
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    }
};