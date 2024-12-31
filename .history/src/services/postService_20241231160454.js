import apiService from './apiService';
import { updateUser } from './userService';

// Fetch 100 posts based on selected party and state (language)
export const fetchPosts = async (categoryId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}&sangh=Polimart`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

export const fetchPostsWithLanguage = async (categoryId,langugeId) => {
    const url  = (`/post/v1/post/category?categoryId=${categoryId}`);
    console.log(url);
    // const response = await apiService.get(`post/v1/post/category?categoryId=9af1a16a-7852-4a64-8d67-fd6e3987c9de`);
     const response = await apiService.get(`/post/v1/post/category?categoryId=${categoryId}&languageId=${langugeId}&sangh=Polimart`);
    return response.data.posts; // Assuming the posts are in the "posts" array
};

export const fetchPostFilter = async (categoryId) => {
    const url = 'https://backend.polimart.in/polimart/post/v1/post/filter?limit=18';
    const body = {
        categoryId: categoryId,
        language: 'HINDI',
        sangh: 'Polimart',
        limit: 18,
    };
    const response = await apiService.post(url, body);
    return response.data.posts;
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
    const response = await apiService.put(`/post/v1/post/order?${queryString}&sangh=Polimart`);
    return response.data; // Assuming a success response
};

export const updatePostOrderNew = async (postIds,languageId,categoryId) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}&language=${languageId}&categoryId=${categoryId}&sangh=Polimart`);
    return response.data; // Assuming a success response
};

// Update post order with the new list of postIds
export const updateSanghPostOrder = async (postIds,sanghId,categoryId) => {
    const queryString = postIds.map((id) => `postIds=${id}`).join('&');
    const response = await apiService.put(`/post/v1/post/order?${queryString}&sangh=${sanghId}&categoryId=${categoryId}&language=HINDI`);
    return response.data; // Assuming a success response
};

// Delete a post by postId
export const deletePost = async (postId) => {
    const response = await apiService.delete(`/post/v1/post/${postId}`);
    return response.data;
};
