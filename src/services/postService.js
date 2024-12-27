import apiService from './apiService';

// Fetch 100 posts based on selected party and state (language)
export const fetchPosts = async (party, language) => {
    const response = await apiService.get(`/poster/post/v1/post?party=${party}&language=${language}`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

// Update post order with the new list of postIds
export const updatePostOrder = async (postIds) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/poster/post/v1/post/order?${queryString}`);
    return response.data; // Assuming a success response
};
