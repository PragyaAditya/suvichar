import React, { useState, useEffect } from 'react';
import { fetchPosts, deletePost } from '../../services/postService'; // Import service calls
import '../../css/Posts/DeletePostsTab.css'; // Create a specific CSS for this tab

const DeleteSanghPostsTab = ({ configData }) => {
    const [posts, setPosts] = useState([]);
    const [selectedSangh, setSelectedSangh] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch posts when the user selects a party and state
    const loadPosts = async () => {
        if (!selectedSangh) {
            alert('Please select sangh.');
            return;
        }
        setIsLoading(true);
        try {
            const fetchedPosts = await fetchPosts(selectedParty, selectedState, true);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete confirmation and API call
    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
            try {
                await deletePost(postId);
                setPosts(posts.filter((post) => post.postId !== postId)); // Remove the deleted post from the list
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div className="delete-posts-tab">
           {/* Dropdown for selecting a sangh */}
           <div className="form-group">
                <label htmlFor="sanghSelect">Select Sangh</label>
                <select
                    id="sanghSelect"
                    className="input-field"
                    value={selectedSangh}
                    onChange={(e) => setSelectedSangh(e.target.value)}
                >
                    <option value="">Select a sangh</option>
                    {configData?.sanghs?.map((sangh) => (
                        <option key={sangh} value={sangh}>
                            {sangh}
                        </option>
                    ))}
                </select>
            </div>


            {/* Fetch button */}
            <button className="button" onClick={loadPosts} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Fetch Posts'}
            </button>

            {/* Display posts and allow deletion */}
            {posts.length > 0 && (
                <div className="post-list">
                    {posts.map((post) => (
                        <div key={post.postId} className="post-item">
                            <img src={post.url} alt="Post" />
                            <button className="delete-btn" onClick={() => handleDelete(post.postId)}>
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeleteSanghPostsTab;
