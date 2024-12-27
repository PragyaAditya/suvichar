import { apiService } from './apiService'; // Import apiService to make the API calls

// Function to delete a user by email ID
export const deleteUser = async (emailId) => {
    try {
        const response = await apiService.delete('/user/v1/user', {
            params: { emailId },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error; // Rethrow error to handle it in the component
    }
};

export const getUserDetails = async (emailId) => {
    try {
        const response = await apiService.get('/poster/subscription/v1/user', {
            params: { emailId },
        });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};
