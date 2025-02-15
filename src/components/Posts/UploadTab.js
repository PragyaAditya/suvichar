import React, { useState } from 'react';
import { Modal, Button, Select, DatePicker, Upload, message, Tag } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { uploadImage, createPost } from '../../services/uploadService';
import {CloudUploadOutlined } from '@ant-design/icons';
import useFilteredData from './LanguageStateFilter/useFilteredData';
import { statesData } from '../../utils/filterData';


const { Option } = Select;
const { Dragger } = Upload;

const UploadModal = ({ configData,updateDetails }) => {
    const [visible, setVisible] = useState(false);
   
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const [scheduledTime, setScheduledTime] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState(''); // Store the file name
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    // const [selectedParty, setSelectedParty] = useState(null);
    // const [selectedState, setSelectedState] = useState(null);
    // const [selectedLanguage, setSelectedLanguage] = useState(null);


    //handles filtering based on language and states..
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

    const isFormComplete =
        scheduledTime && selectedLanguage && imageFile && selectedCategories.length > 0;

    const handleFileChange = async ({ file }) => {
        if (file.status === 'removed') {
            setImageFile(null);
            setFileName('');
            setOriginalSize(null);
            setCompressedSize(null);
            return;
        }

        if (file.originFileObj) {
            const originalFileSize = (file.originFileObj.size / 1024).toFixed(2);
            setOriginalSize(originalFileSize);

            const options = {
                maxSizeMB: 0.05,
                useWebp: true,
                fileType: 'image/webp',
                alwaysKeepResolution: true,
            };

            try {
                const compressed = await imageCompression(file.originFileObj, options);
                const compressedFileSize = (compressed.size / 1024).toFixed(2);
                setCompressedSize(compressedFileSize);
                setImageFile(compressed);
                setFileName(file.name); // Set file name
            } catch (error) {
                console.error('Error compressing the image:', error);
                message.error('Error compressing the image. Please try again.');
            }
        }
    };

    const handleUpload = async () => {
        if (!isFormComplete) {
            message.warning('Please fill in all required fields before uploading.');
            return;
        }

        setIsUploading(true);
        try {
            const uploadResponse = await uploadImage(imageFile, 'IMAGE');
            const fileUrl = uploadResponse;

            const postData = {
                description: '',
                sangh: 'Polimart',
                language: selectedLanguage,
                mediaType: 'IMAGE',
                liveAt: scheduledTime.unix() * 1000,
                categoryIds: selectedCategories,
                url: fileUrl,
                political: false,
            };

            if (selectedCategories.includes('9af1a16a-7852-4a64-8d67-fd6e3987c9de')) {
                postData.party = selectedParty;
                postData.state = selectedState;
                postData.political = true;
            }

            await createPost(postData);
            message.success('Upload and post creation successful!');


            updateDetails(selectedParty,selectedLanguage,selectedState,selectedCategories[0])

            // Reset the state to clear the form
            setSelectedParty(null);
            setSelectedState(null);
            setSelectedCategories([]);
            setSelectedLanguage(null);
            setScheduledTime(null);
            setImageFile(null);
            setFileName('');
            setOriginalSize(null);
            setCompressedSize(null);

            setVisible(false);
        } catch (error) {
            console.error('Error during upload or post creation:', error);
            message.error('Error during upload or post creation. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Button icon={<CloudUploadOutlined />} type="primary" onClick={() => setVisible(true)}>
                Upload Post
            </Button>
            <Modal
                title="Upload Post"
                visible={visible}
                onOk={handleUpload}
                onCancel={() => setVisible(false)}
                confirmLoading={isUploading}
                okText={isUploading ? 'Uploading...' : 'Upload'}
                cancelText="Cancel"
                okButtonProps={{ disabled: !isFormComplete }}
            >

                <div style={{ marginBottom: '16px' }}>
                    <label>Select Language</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a language"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        allowClear
                    >
                        {configData?.languages?.map((language) => (
                            <Option key={language} value={language}>
                                {language}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Select State</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a state"
                        value={selectedState}
                        onChange={handleStateChange}
                        allowClear
                    >
                        {filteredStates.map((item) => (
                            <Option key={item.state} value={item.state}>
                                {item.state}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ paddingTop: '10px', marginBottom: '16px' }}>
                    <label>Select Party</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a party"
                        value={selectedParty}
                        onChange={setSelectedParty}
                        allowClear
                    >
                        {filteredParties.map((party) => (
                            <Option key={party} value={party}>
                                {party}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Select Categories</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select categories"
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                    >
                        {configData?.categories?.map((category) => (
                            <Option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Schedule Post Time</label>
                    <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        value={scheduledTime}
                        onChange={setScheduledTime}
                        placeholder="Select time"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Upload Image</label>
                    <Dragger
                        accept="image/*"
                        customRequest={({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0)}
                        onChange={handleFileChange}
                        showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                    {fileName && (
                        <Tag color="blue" style={{ padding:'4px 8px', marginTop: '12px' }}>
                            {fileName}
                        </Tag>
                    )}
                </div>

                {originalSize && <p>Original Image Size: {originalSize} KB</p>}
                {compressedSize && <p>Compressed Image Size: {compressedSize} KB</p>}
            </Modal>
        </>
    );
};

export default UploadModal;
