import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage, createPost } from '../services/uploadService'; // Import the new service
import '../css/UploadTab.css';

const UploadTab = ({ configData }) => {
    const [selectedParty, setSelectedParty] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [compressedFileUrl, setCompressedFileUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Check if all fields are filled
    const isFormComplete = selectedParty && selectedState && scheduledTime && imageFile;

    // Handle file selection and compression
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const originalFileSize = (file.size / 1024).toFixed(2); // Size in KB
            setOriginalSize(originalFileSize);

            const options = {
                maxSizeMB: 0.05, // Aggressive lossy compression
                useWebp: true,
                fileType: 'image/webp',
                alwaysKeepResolution: true,
            };

            try {
                const compressed = await imageCompression(file, options);
                const compressedFileSize = (compressed.size / 1024).toFixed(2); // Size in KB
                setCompressedSize(compressedFileSize);
                setImageFile(compressed);
            } catch (error) {
                console.error('Error compressing the image:', error);
            }
        }
    };

    // Handle the upload and post creation process
    const handleUpload = async () => {
        if (!isFormComplete) return;

        setIsUploading(true);
        try {
            // Step 1: Upload the compressed image
            const uploadResponse = await uploadImage(imageFile, 'IMAGE');
            const fileUrl = uploadResponse; // Assuming the response contains the URL

            // Step 2: Create the post with the file URL and user inputs
            const postData = {
                description: '',
                party: selectedParty,
                language: selectedState,
                mediaType: 'IMAGE',
                liveAt: new Date(scheduledTime).getTime(),
                url: fileUrl,
            };

            await createPost(postData);
            setUploadSuccess(true);
        } catch (error) {
            console.error('Error during upload or post creation:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-pane">
            {/* Dropdown for selecting a party */}
            <div className="form-group">
                <label htmlFor="partySelect">Select Party</label>
                <select
                    id="partySelect"
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

            {/* Date and time selector */}
            <div className="form-group">
                <label htmlFor="scheduleTime">Schedule Post Time</label>
                <input
                    type="datetime-local"
                    id="scheduleTime"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                />
            </div>

            {/* File input for selecting an image */}
            <div className="form-group">
                <label htmlFor="imageUpload">Select Image</label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* Display file sizes */}
            {originalSize && <p>Original Image Size: {originalSize} KB</p>}
            {compressedSize && <p>Compressed Image Size: {compressedSize} KB</p>}

            {/* Upload button */}
            <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={!isFormComplete || isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>

            {/* Success message */}
            {uploadSuccess && <p>Upload and post creation successful!</p>}
        </div>
    );
};

export default UploadTab;
