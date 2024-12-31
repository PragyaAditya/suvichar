import apiClient from './apiService'; // Import apiService to make the API calls

// Function to delete a user by email ID
export const deleteUser = async (emailId) => {
    try {
        const response = await apiClient.delete('/user/v1/user', {
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
        const response = await apiClient.get('/subscription/v1/user', {
            params: { emailId },
        });
        return response.data; // Return the data from the response
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const updateUser = async (partyId,stateId) => {
    const body = {
        sangh: 'Polimart',
        language: 'HINDI',
        party: partyId,
        state: stateId,
    };
    const response = await apiClient.put('/user/v1/user', body);
    return response.data;
};

