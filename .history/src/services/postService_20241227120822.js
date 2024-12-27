import apiService from './apiService';

// Fetch 100 posts based on selected party and state (language)
export const fetchPosts = async (categoryId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

// Fetch 100 posts based on selected party and state (language)
export const fetchPostsWithSangh = async (categoryId,sanghId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}&sangh=${sanghId}`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

// Update post order with the new list of postIds
export const updatePostOrder = async (postIds) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}`);
    return response.data; // Assuming a success response
};

// Update post order with the new list of postIds
export const updateSanghPostOrder = async (postIds,categoryId) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}&sangh=&categoryId=${categoryId}`);
    return response.data; // Assuming a success response
};

// Delete a post by postId
export const deletePost = async (postId) => {
    const response = await apiService.delete(`/post/v1/post/${postId}`);
    return response.data;
};
