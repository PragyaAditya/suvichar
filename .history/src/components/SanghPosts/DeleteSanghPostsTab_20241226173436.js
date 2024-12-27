import React, { useState, useEffect } from 'react';
import { fetchPosts, deletePost } from '../../services/postService'; // Import service calls
import '../../css/Posts/DeletePostsTab.css'; // Create a specific CSS for this tab

const DeleteSanghPostsTab = ({ configData }) => {
    const [posts, setPosts] = useState([]);
    const [selectedParty, setSelectedParty] = useState(''); // State for selected party
    const [selectedState, setSelectedState] = useState(''); // State for selected state
    const [isLoading, setIsLoading] = useState(false);

    // Fetch posts when the user selects a party and state
    const loadPosts = async () => {
        if (!selectedParty || !selectedState) {
            alert('Please select both party and state.');
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
            {/* Dropdown for selecting a party */}
            <div className="form-group">
                <label htmlFor="partySelect">Select Party</label>
                <select
                    id="partySelect"
                    className="input-field"
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                >
                    <option value="">Select a party</option>
                    {configData?.parties?.map((party) => (
                        <option key={party} value={party}>
                            {party}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dropdown for selecting a state */}
            <div className="form-group">
                <label htmlFor="stateSelect">Select State</label>
                <select
                    id="stateSelect"
                    className="input-field"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    <option value="">Select a state</option>
                    {configData?.states?.map((state) => (
                        <option key={state} value={state}>
                            {state}
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

export default DeletePostsTab;
