import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage, createPost } from '../../services/uploadService'; // Import the new service
import '../../css/Posts/UploadTab.css';

const UploadSanghTab = ({ configData }) => {

    // const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSangh, setSelectedSangh] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [compressedFileUrl, setCompressedFileUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Check if all fields are filled
    const isFormComplete =  scheduledTime && imageFile && selectedSangh;
    // const isFormComplete =  scheduledTime && imageFile && selectedCategory && selectedSangh;

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
                language: "HINDI",
                mediaType: 'IMAGE',
                liveAt: new Date(scheduledTime).getTime(), // Ensure this is a timestamp
                categoryIds: ["a6807f12-1ab3-4bde-afd4-2a7c4ef009db"], // Pass the selected category ID as an array
                sangh:selectedSangh,
                url: fileUrl, // Set the uploaded image URL
            };
    
            console.log('Sangh Post Data:', JSON.stringify(postData, null, 2)); // Log post data
    
            // Step 3: Send the post request
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
                className="button"
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

export default UploadSanghTab;
