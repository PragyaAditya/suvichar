import React, { useState } from 'react';
import { updateActiveGateways } from '../../services/configService';
import '../../css/Config/ActiveGatewaysTab.css';

const ActiveGatewaysTab = () => {
    const [gateways, setGateways] = useState([
        { id: 'RAZORPAY', name: 'Razorpay', selected: false },
        { id: 'PHONE_PE', name: 'PhonePe', selected: false },
    ]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleToggle = (index) => {
        const newGateways = [...gateways];
        newGateways[index].selected = !newGateways[index].selected;
        setGateways(newGateways);
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDrop = (index) => {
        if (draggedIndex === null) return;
        const reorderedGateways = [...gateways];
        const [draggedItem] = reorderedGateways.splice(draggedIndex, 1);
        reorderedGateways.splice(index, 0, draggedItem);
        setGateways(reorderedGateways);
        setDraggedIndex(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow the drop
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        const selectedGateways = gateways.filter(gateway => gateway.selected).map(gateway => gateway.id);
        if (selectedGateways.length === 0) {
            setErrorMessage('Please select at least one gateway.');
            return;
        }
        try {
            await updateActiveGateways(selectedGateways);
            setSuccessMessage('Gateways updated successfully.');
        } catch (error) {
            setErrorMessage('Error updating gateways.');
        }
    };

    return (
        <div className="active-gateways-tab">
            <h2>Manage Active Payment Gateways</h2>

            {/* Toggle Switches */}
            <div className="toggle-gateways">
                {gateways.map((gateway, index) => (
                    <label key={gateway.id} className="switch-label">
                        <span>{gateway.name}</span>
                        <input
                            type="checkbox"
                            checked={gateway.selected}
                            onChange={() => handleToggle(index)}
                        />
                        <span className="slider round"></span>
                    </label>
                ))}
            </div>

            {/* Drag and Drop for Ordering */}
            <div className="draggable-list">
                {gateways
                    .filter((gateway) => gateway.selected)
                    .map((gateway, index) => (
                        <div
                            key={gateway.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            className="draggable-item"
                        >
                            {gateway.name}
                        </div>
                    ))}
            </div>

            {/* Submit Button */}
            <button className="button" onClick={handleSubmit}>
                Submit
            </button>

            {/* Success/Error Messages */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ActiveGatewaysTab;
