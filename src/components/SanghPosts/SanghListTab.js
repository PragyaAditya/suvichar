import React, { useState } from 'react';
import { fetchPostsWithSangh, updateSanghPostOrder, deletePost, fetchPostFilter } from '../../services/postService';
import { Button, Select, Spin, message, Divider, Empty, Modal } from 'antd';
import { ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import '../../css/Posts/OrderPostsTab.css';
import UploadSanghTab from './UploadSanghTab';
import { timeout } from '../../utils/utils';

const { Option } = Select;

const SanghListTab = ({ configData }) => {
    const [selectedcategory, setSelectedcategory] = useState('a6807f12-1ab3-4bde-afd4-2a7c4ef009db');
    const [selectedSangh, setSelectedSangh] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [postOrder, setPostOrder] = useState([]);
    const [hasFetchedPosts, setHasFetchedPosts] = useState(false);

    const isFormComplete = selectedSangh && selectedcategory;

    const handleDelete = async (postId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this post?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deletePost(postId);
                    setPosts(posts.filter((post) => post.postId !== postId));
                    message.success('Post deleted successfully');
                } catch (error) {
                    console.error('Error deleting post:', error);
                    message.error('Failed to delete post');
                }
            },
        });
    };

    const handleFetchPosts = async () => {
        if (!isFormComplete) {
            message.warning('Please select both sangh and category.');
            return;
        }
        setIsLoading(true);
        await timeout(200);
        try {
            // const fetchedPosts = await fetchPostsWithSangh(selectedcategory, selectedSangh);
            const fetchedPosts = await fetchPostFilter(selectedcategory,undefined,'HINDI',undefined,selectedSangh);
            setPosts(fetchedPosts);
            setPostOrder(fetchedPosts.map((post) => post.postId));
            setHasFetchedPosts(true)
        } catch (error) {
            console.error('Error fetching posts:', error);
            message.error('Failed to fetch posts');
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
        setPostOrder(reorderedPosts.map((post) => post.postId));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpdateOrder = async () => {
        setIsReordering(true);
        try {
            await updateSanghPostOrder(postOrder, selectedSangh, selectedcategory);
            message.success('Post order updated successfully.');
        } catch (error) {
            console.error('Error updating post order:', error);
            message.error('Failed to update post order');
        } finally {
            setIsReordering(false);
        }
    };

    const updateDetails = (sangh) => {
        setSelectedSangh(sangh);
        handleFetchPosts();
    };

    return (
        <div className="order-posts-tab">

            {/* Dropdown for selecting sangh */}
            <Select
                placeholder="Select Sangh"
                value={selectedSangh}
                onChange={(value) => setSelectedSangh(value)}
                className="filter-select"
                allowClear={true}
            >
                {configData?.sanghs?.map((sangh) => (
                    <Option key={sangh} value={sangh}>
                        {sangh}
                    </Option>
                ))}
            </Select>

            {/* Buttons row */}
            <div className="action-buttons">
                <UploadSanghTab updateDetails={updateDetails} configData={configData} />
                <Button
                    icon={<ReloadOutlined />}
                    type="primary"
                    onClick={handleFetchPosts}
                    loading={isLoading}
                    className="full-width-btn"
                >
                    Fetch Posts
                </Button>
                {hasFetchedPosts && (
                    <Button
                        icon={<SwapOutlined />}
                        type="default"
                        onClick={handleUpdateOrder}
                        loading={isReordering}
                        className="full-width-btn"
                    >
                        Update Post Order
                    </Button>
                )}
            </div>

            {/* Divider between buttons and posts list */}
            <Divider />

            {/* Loading Indicator */}
            <Spin spinning={isLoading} size='large'>
                {/* Posts List */}
                {posts.length > 0 ? (
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
                                <button className="delete-btn" onClick={() => handleDelete(post.postId)}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description={'No Posts!'} />
                )}
            </Spin>


        </div>
    );
};

export default SanghListTab;
