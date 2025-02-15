import React, { useState, useEffect } from 'react';
import { fetchPostsWithLanguage, updatePostOrderNew, deletePost, fetchPostFilter } from '../../services/postService';
import { Select, Button, Row, Col, Spin, Modal, message, Card, Divider, Empty } from 'antd';
import '../../css/Posts/OrderPostsTab.css';
import UploadModal from './UploadTab';
import { ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import { updateUser } from '../../services/userService';
import { statesData } from '../../utils/filterData';
import { timeout } from '../../utils/utils';
import useFilteredData from './LanguageStateFilter/useFilteredData';

const { Option } = Select;

const PostsListTab = ({ configData }) => {
    
    const [selectedcategory, setSelectedcategory] = useState(null);
    const [hasFetchedPosts, setHasFetchedPosts] = useState(false);
    // const [selectedLanguage, setSelectedLanguage] = useState(null);
    // const [selectedState, setSelectedState] = useState(null);
    // const [selectedParty, setSelectedParty] = useState(null);

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [postOrder, setPostOrder] = useState([]);

    // Method to update selectedParty
    const updateDetails = (party, language, state, category) => {
        setSelectedParty(party);
        setSelectedState(state);
        setSelectedLanguage(language);
        setSelectedcategory(category);
        handleFetchPosts();
    };

    

    //handles filtering based on language,state..
    const {
        filteredStates,
        filteredParties,
        selectedLanguage,
        selectedState,
        selectedParty,
        setSelectedState,
        setSelectedParty,
        setSelectedLanguage,
        handleLanguageChange,
        handleStateChange,
    } = useFilteredData(statesData, configData);


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

    const resetPost = () => {
        setPosts([]);
        setPostOrder([]);
    }



    const handleFetchPosts = async () => {
        if (!selectedcategory) {
            message.warning('Please select both category and language.');
            return;
        }
        resetPost();
        setIsLoading(true);
        await timeout(200);
        try {
            //IMP-DONT-DELETE 
            // await updateUser(selectedParty,selectedState?.replace(' ','_'),selectedLanguage);
            // const fetchedPosts = await fetchPostsWithLanguage(selectedcategory, selectedLanguage);
            const fetchedPosts = await fetchPostFilter(selectedcategory,selectedState, selectedLanguage,selectedParty,"Polimart");
            setPosts(fetchedPosts);
            setPostOrder(fetchedPosts.map((post) => post.postId));
            setHasFetchedPosts(true);
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
            await updatePostOrderNew(postOrder, selectedLanguage, selectedcategory);
            message.success('Post order updated successfully.');
        } catch (error) {
            console.error('Error updating post order:', error);
            message.error('Failed to update post order');
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="order-posts-tab">
            {/* Filters */}
            <Row gutter={[16, 16]} className="filters-row">
                <Col span={6}>
                    <Select
                        placeholder="Select Language"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="filter-select"
                        allowClear={true}
                    >
                        {configData?.languages?.map((language) => (
                            <Option key={language} value={language}>
                                {language}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Select State"
                        value={selectedState}
                        onChange={handleStateChange}
                        className="filter-select"
                        allowClear={true}
                    >
                        {filteredStates.map((item) => (
                            <Option key={item.state} value={item.state}>
                                {item.state}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Select Party"
                        value={selectedParty}
                        onChange={(value) => setSelectedParty(value)}
                        className="filter-select"
                        allowClear={true}
                    >
                        {filteredParties.map((party) => (
                            <Option key={party} value={party}>
                                {party}
                            </Option>
                        ))}
                    </Select>
                </Col>


                <Col span={6}>
                    <Select
                        placeholder="Select Category"
                        value={selectedcategory}
                        onChange={(value) => setSelectedcategory(value)}
                        className="filter-select"
                        allowClear={true}
                    >
                        {configData?.categories?.map((category) => (
                            <Option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            {/* Action Buttons */}
            <div className="action-buttons">
                <UploadModal updateDetails={updateDetails} configData={configData} />

                <Button icon={<ReloadOutlined />} type="primary" onClick={handleFetchPosts} loading={isLoading} className="full-width-btn">
                    Fetch Posts
                </Button>

                {hasFetchedPosts && (
                    <Button icon={<SwapOutlined />} type="default" onClick={handleUpdateOrder} loading={isReordering} className="full-width-btn">
                        Update Post Order
                    </Button>
                )}
            </div>

            {/* Divider between buttons and posts list */}
            <Divider />


            <Spin spinning={isLoading} size="large" >
                {/* Posts List */}
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
                                <button className="delete-btn" onClick={() => handleDelete(post.postId)}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {posts.length == 0 && (<Empty description={'No Posts!'} />)}

            </Spin>

        </div>
    );
};

export default PostsListTab;
