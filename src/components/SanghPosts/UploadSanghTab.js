import React, { useState } from 'react';
import { Modal, Button, Select, DatePicker, Upload, message, Tag } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import imageCompression from 'browser-image-compression';
import { uploadImage, createPost } from '../../services/uploadService';

const { Option } = Select;
const { Dragger } = Upload;

const UploadSanghTab = ({ configData,updateDetails }) => {
    const [visible, setVisible] = useState(false);
    const [selectedSangh, setSelectedSangh] = useState(null);
    const [scheduledTime, setScheduledTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const isFormComplete = scheduledTime && imageFile && selectedSangh;

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
                setFileName(file.name);
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
                language: "HINDI",
                mediaType: 'IMAGE',
                liveAt: new Date(scheduledTime).getTime(),
                categoryIds: ["a6807f12-1ab3-4bde-afd4-2a7c4ef009db"], 
                sangh: selectedSangh,
                url: fileUrl,
            };

            await createPost(postData);
            message.success('Upload and post creation successful!');
            setVisible(false); // Close the modal after successful upload

            updateDetails(selectedSangh);
            // Reset form state
            setSelectedSangh(null);
            setScheduledTime('');
            setImageFile(null);
            setFileName('');
            setOriginalSize(null);
            setCompressedSize(null);
        } catch (error) {
            console.error('Error during upload or post creation:', error);
            message.error('Error during upload or post creation. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Button
                icon={<CloudUploadOutlined />}
                type="primary"
                onClick={() => setVisible(true)}
            >
                Upload Sangh Post
            </Button>
            <Modal
                title="Upload Sangh Post"
                visible={visible}
                onOk={handleUpload}
                onCancel={() => setVisible(false)}
                confirmLoading={isUploading}
                okText={isUploading ? 'Uploading...' : 'Upload'}
                cancelText="Cancel"
                okButtonProps={{ disabled: !isFormComplete }}
            >
                <div style={{ marginBottom: '16px' }}>
                    <label>Select Sangh</label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a sangh"
                        value={selectedSangh}
                        onChange={setSelectedSangh}
                        allowClear
                    >
                        {configData?.sanghs?.map((sangh) => (
                            <Option key={sangh} value={sangh}>
                                {sangh}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label>Schedule Post Time</label>
                    <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        onChange={(value) => setScheduledTime(value)}
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
                        <Tag color="blue" style={{ marginTop: '12px' }}>
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

export default UploadSanghTab;
