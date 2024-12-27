import axios from 'axios';

// Retrieve stored JWT token, device-id, and app-user-id
const getHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    const deviceId = localStorage.getItem('deviceId');
    const appUserId = localStorage.getItem('appUserId');

    return {
        'token': token,
        'device-id': deviceId,
        'app-user-id': appUserId
        
    };
};

// Create an Axios instance with default headers
const apiClient = axios.create({
    //baseURL: 'https://backend.designboxconsuting.com/poster',
    //baseURL: 'http://localhost:8090/poster',
    baseURL: 'https://backend.polimart.in/polimart',
    headers: getHeaders(),
});

// Automatically inject headers in every request
apiClient.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...getHeaders() };
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            handleLogout(); // Log out and redirect on 403 error
        }
        return Promise.reject(error);
    }
);

// Function to clear tokens and redirect to the sign-in page
const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('appUserId');
    window.location.href = '/'; // Redirect to sign-in page
};

export default apiClient;
