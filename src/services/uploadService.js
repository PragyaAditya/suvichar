import apiService from './apiService';

// Upload the compressed image to the backend with media-type as 'image/webp'
export const uploadImage = async (file, mediaType = 'IMAGE') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType);

    // Custom headers for this request
    const headers = {
        'media-type': 'image/webp', // Add the media-type header with WebP format
    };

    // Use apiService to make the POST request
    const response = await apiService.post('/files/v1/new', formData, { headers });
    return response.data; // Assuming response contains the uploaded file URL
};

// Create a post with the uploaded file URL
export const createPost = async (postData) => {
    const response = await apiService.post('/post/v1/post', postData);
    return response.data;
};
