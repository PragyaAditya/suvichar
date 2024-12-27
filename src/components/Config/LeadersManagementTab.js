import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../services/uploadService'; // Compress and upload image
import {fetchConfig, updateLeaders} from '../../services/configService'; // Update leaders API
import imageCompression from 'browser-image-compression'; // Import image compression library
import '../../css/Config/LeadersManagementTab.css';

const LeadersManagementTab = ({ configData, setConfigData }) => {
    const [selectedState, setSelectedState] = useState('');
    const [selectedParty, setSelectedParty] = useState('');
    const [leaderImages, setLeaderImages] = useState([]);
    const [draggedLeader, setDraggedLeader] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);

    useEffect(() => {
        if (selectedState && selectedParty) {
            loadLeaderImages();
        }
    }, [selectedState, selectedParty]);

    const loadLeaderImages = () => {
        let stateInfo = configData.stateInfos.find((info) => info.state === selectedState);
        if (!stateInfo) {
            stateInfo = configData.otherStateInfos.find((info) => info.state === selectedState);
        }

        if (stateInfo) {
            const partyInfo = stateInfo.partyInfoList.find((party) => party.partyId === selectedParty);
            if (partyInfo && partyInfo.leadersImgUrls) {
                setLeaderImages(partyInfo.leadersImgUrls);
                setErrorMessage(''); // Clear the error if leaders are found
            } else {
                setLeaderImages([]);
                setErrorMessage('No leaders found for the selected state and party.');
            }
        } else {
            setLeaderImages([]);
            setErrorMessage('No state information available.');
        }
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedParty('');
        setLeaderImages([]);
        setErrorMessage('');
    };

    const handlePartyChange = (e) => {
        setSelectedParty(e.target.value);
        setLeaderImages([]);
        setErrorMessage('');
    };

    const handleDragStart = (index) => {
        setDraggedLeader(index);
    };

    const handleDrop = (index) => {
        const updatedLeaders = [...leaderImages];
        const [removed] = updatedLeaders.splice(draggedLeader, 1);
        updatedLeaders.splice(index, 0, removed);
        setLeaderImages(updatedLeaders);
        setDraggedLeader(null);
    };

    const handleImageRemove = (index) => {
        const updatedLeaders = leaderImages.filter((_, i) => i !== index);
        setLeaderImages(updatedLeaders);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 0.05, // Aggressive lossy compression
                    useWebp: true,
                    fileType: 'image/webp',
                };

                // Compress the image
                const compressedFile = await imageCompression(file, options);
                const originalFileSize = (file.size / 1024).toFixed(2); // Original file size in KB
                const compressedFileSize = (compressedFile.size / 1024).toFixed(2); // Compressed file size in KB

                setOriginalSize(originalFileSize);
                setCompressedSize(compressedFileSize);

                // Upload the compressed image
                const webpUrl = await uploadImage(compressedFile); // Upload compressed file
                setLeaderImages((prevImages) => [...prevImages, webpUrl]);

                // Clear the error message upon successful upload
                setErrorMessage('');
            } catch (error) {
                setErrorMessage('Error uploading image.');
                console.error('Image upload error:', error);
            }
        }
    };

    const handleSaveLeaders = async () => {
        try {
            await updateLeaders(selectedState, selectedParty, leaderImages);
            alert('Leaders updated successfully!');
            const updatedConfig = await fetchConfig();
            setConfigData(updatedConfig);
        } catch (error) {
            setErrorMessage('Error updating leaders.');
        }
    };

    return (
        <div className="leaders-management-tab">
            <h2>Manage Leaders</h2>

            {/* State Selection */}
            <div className="form-group">
                <label htmlFor="stateSelect">Select State</label>
                <select id="stateSelect" value={selectedState} onChange={handleStateChange}>
                    <option value="">Select a state</option>
                    {configData.states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            {/* Party Selection */}
            {selectedState && (
                <div className="form-group">
                    <label htmlFor="partySelect">Select Party</label>
                    <select id="partySelect" value={selectedParty} onChange={handlePartyChange}>
                        <option value="">Select a party</option>
                        {configData.parties.map((party) => (
                            <option key={party} value={party}>
                                {party}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* File Upload */}
            {selectedState && selectedParty && (
                <div className="form-group">
                    <label htmlFor="fileUpload">Upload Leader Image</label>
                    <input type="file" id="fileUpload" accept="image/*" onChange={handleImageUpload} />
                    {originalSize > 0 && compressedSize > 0 && (
                        <p>Original Size: {originalSize} KB, Compressed Size: {compressedSize} KB</p>
                    )}
                </div>
            )}

            {/* Save Button */}
            {leaderImages.length > 0 && (
                <button className="button" onClick={handleSaveLeaders}>
                    Save Leader Order
                </button>
            )}

            {/* Error Message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Display leader images in rows of 3 */}
            {leaderImages.length > 0 && (
                <div className="leaders-list">
                    {leaderImages.map((imgUrl, index) => (
                        <div
                            key={index}
                            className="leader-item"
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                        >
                            <img src={imgUrl} alt={`Leader ${index}`} className="leader-image" />
                            <span className="remove-icon" onClick={() => handleImageRemove(index)}>✖</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeadersManagementTab;
