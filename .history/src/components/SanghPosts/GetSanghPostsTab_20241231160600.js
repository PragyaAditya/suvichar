import React, { useState } from 'react';
import { fetchPostsWithSangh, updateSanghPostOrder } from '../../services/postService';
import '../../css/Posts/OrderPostsTab.css';

const GetSanghPostsTab = ({ configData }) => {
    const [selectedcategory, setSelectedcategory] = useState('a6807f12-1ab3-4bde-afd4-2a7c4ef009db');
    const [selectedSangh, setSelectedSangh] = useState('');
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [postOrder, setPostOrder] = useState([]);

    const isFormComplete =  selectedSangh && selectedSangh

    const handleFetchPosts = async () => {
        if (!isFormComplete) {
            alert('Please select both sangh.');
            return;
        }
        setIsLoading(true);
        try {
            const fetchedPosts = await fetchPostsWithSangh(selectedcategory,selectedSangh);
            setPosts(fetchedPosts);
            setPostOrder(fetchedPosts.map((post) => post.postId)); // Store initial post order
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('postIndex', index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData('postIndex');
        const reorderedPosts = [...posts];
        const [draggedPost] = reorderedPosts.splice(draggedIndex, 1);
        reorderedPosts.splice(index, 0, draggedPost);
        setPosts(reorderedPosts);
        setPostOrder(reorderedPosts.map((post) => post.postId)); // Update post order
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpdateOrder = async () => {
        setIsReordering(true);
        try {
            await updateSanghPostOrder(postOrder,selectedSangh,selectedcategory);
            alert('Post order updated successfully.');
        } catch (error) {
            console.error('Error updating post order:', error);
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="order-posts-tab">

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
            <button className="button" onClick={handleFetchPosts} disabled={isLoading}>
                {isLoading ? 'Fetching...' : 'Fetch Posts'}
            </button>

            {/* Update post order button */}
            {posts.length > 0 && (
                <button className="button" onClick={handleUpdateOrder} disabled={isReordering}>
                    {isReordering ? 'Updating...' : 'Update Post Order'}
                </button>
            )}

            {/* Display posts and allow reordering */}
            {posts.length > 0 && (
                <div className="post-list">
                    {posts.map((post, index) => (
                        <div
                            key={post.postId}
                            className="post-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                        >
                            <img src={post.url} alt="Post" className="post-image" />
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    );
};

export default GetSanghPostsTab;
