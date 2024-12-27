import axios from 'axios';

//const API_URL = 'https://backend.designboxconsuting.com/poster/user/v1/admin'; // Base API URL
// const API_URL = 'https://neta-backend.netaapp.in/poster/user/v1/admin'; // Base API URL
const API_URL = 'https://backend.polimart.in/polimart/user/v1/admin'

// Function to handle login and return JWT token and user details
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, null, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: { username, password },
        },headers );

        if (response.data.success) {
            const token = response.data.message; // JWT token
            const appUserId = response.data.data.userId; // Retrieve app-user-id
            const role = response.data.data.role;

            // Store both JWT token and app-user-id in localStorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('appUserId', appUserId);
            localStorage.setItem('role', role)
            return { token, appUserId, role, success: true };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Error occurred during login' };
    }
};
