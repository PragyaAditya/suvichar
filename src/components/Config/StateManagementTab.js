import React, { useState, useEffect } from 'react';
import { updateStateOrder } from '../../services/configService';
import '../../css/Config/StateManagementTab.css';

const StateManagementTab = ({ configData }) => {
    const [stateInfos, setStateInfos] = useState(configData.stateInfos || []); // Current states
    const [availableStates, setAvailableStates] = useState([]); // Available states for dropdown
    const [selectedState, setSelectedState] = useState('');
    const [packageName, setPackageName] = useState('com.designbox.postersB');
    const [draggedItemIndex, setDraggedItemIndex] = useState(null); // Keep track of the dragged item
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Initialize availableStates by excluding states already in stateInfos
    useEffect(() => {
        const initialAvailableStates = (configData.states || []).filter(
            (state) => !stateInfos.some((info) => info.state === state)
        );
        setAvailableStates(initialAvailableStates);
    }, [configData.states, stateInfos]);

    // Add state to the list when selected
    const handleSelectState = (e) => {
        const newState = e.target.value;
        if (newState) {
            const stateInfo = { state: newState, name: newState, leadersImgUrls: [] };
            setStateInfos([...stateInfos, stateInfo]);
            setAvailableStates(availableStates.filter((state) => state !== newState));
            setSelectedState('');
        }
    };

    // Remove a state from the list
    const handleRemoveState = (stateToRemove) => {
        setStateInfos(stateInfos.filter((info) => info.state !== stateToRemove));
        setAvailableStates([...availableStates, stateToRemove].sort());
    };

    // Handle drag start
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    // Handle drop
    const handleDrop = (index) => {
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        const reorderedStates = [...stateInfos];
        const [draggedItem] = reorderedStates.splice(draggedItemIndex, 1);
        reorderedStates.splice(index, 0, draggedItem);
        setStateInfos(reorderedStates);
        setDraggedItemIndex(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary for allowing drop
    };

    // Handle submit to update state order
    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        const orderedStates = stateInfos.map((info) => info.state);
        if (orderedStates.length === 0) {
            setErrorMessage('Please add at least one state.');
            return;
        }
        try {
            await updateStateOrder(packageName, orderedStates);
            setSuccessMessage('State order updated successfully.');
        } catch (error) {
            setErrorMessage('Error updating state order.');
        }
    };

    return (
        <div className="state-management-tab">
            <h2>Manage States</h2>

            {/* Dropdown for selecting a state */}
            <div className="select-state">
                <label htmlFor="stateSelect">Select State:</label>
                <select
                    id="stateSelect"
                    value={selectedState}
                    onChange={handleSelectState}
                >
                    <option value="">Select a state</option>
                    {availableStates.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            {/* Drag and Drop for States */}
            <div className="state-list">
                {stateInfos.map((info, index) => (
                    <div
                        key={info.state}
                        className="state-item"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                    >
                        <span>{info.name}</span>
                        <button
                            className="remove-btn"
                            onClick={() => handleRemoveState(info.state)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* Package Name Input */}
            <div className="package-name">
                <label htmlFor="packageName">Package Name:</label>
                <input
                    type="text"
                    id="packageName"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                />
            </div>

            {/* Submit Button */}
            <button className="button" onClick={handleSubmit}>
                Update State Order
            </button>

            {/* Success/Error Messages */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default StateManagementTab;
