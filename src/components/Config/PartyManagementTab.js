import React, { useState, useEffect } from 'react';
import { updatePartyOrder, fetchConfig  } from '../../services/configService'; // Assuming configService handles API calls
import '../../css/Config/PartyManagementTab.css';

const PartyManagementTab = ({ configData, setConfigData}) => {
    const [selectedState, setSelectedState] = useState('');
    const [availableParties, setAvailableParties] = useState([]);
    const [partyOrder, setPartyOrder] = useState([]);
    const [draggedPartyIndex, setDraggedPartyIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Populate available parties minus those already in partyOrder
    useEffect(() => {
        if (selectedState) {
            const stateInfo = configData.stateInfos.find((info) => info.state === selectedState);
            const selectedParties = stateInfo ? stateInfo.partyInfoList.map((party) => party.partyId) : [];
            setPartyOrder(selectedParties);
            setAvailableParties(configData.parties.filter((party) => !selectedParties.includes(party)));
        }
    }, [selectedState, configData]);

    const handlePartySelect = (e) => {
        const selectedParty = e.target.value;
        if (!partyOrder.includes(selectedParty)) {
            setPartyOrder([...partyOrder, selectedParty]);
            setAvailableParties(availableParties.filter((party) => party !== selectedParty));
        }
    };

    const handleDragStart = (index) => {
        setDraggedPartyIndex(index);
    };

    const handleDrop = (index) => {
        const updatedParties = [...partyOrder];
        const draggedParty = updatedParties.splice(draggedPartyIndex, 1)[0];
        updatedParties.splice(index, 0, draggedParty);
        setPartyOrder(updatedParties);
        setDraggedPartyIndex(null);
    };

    const handleRemoveParty = (party) => {
        setPartyOrder(partyOrder.filter((p) => p !== party));
        setAvailableParties([...availableParties, party]);
    };

    const handleUpdateParties = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        if (!selectedState) {
            setErrorMessage('Please select a state first.');
            return;
        }

        try {
            await updatePartyOrder(selectedState, partyOrder); // Assuming updatePartyOrder is a function in configService
            setSuccessMessage('Party order updated successfully.');
            const updatedConfig = await fetchConfig();
            setConfigData(updatedConfig);
        } catch (error) {
            setErrorMessage('Error updating party order.');
        }
    };

    return (
        <div className="party-management-tab">
            <h2>Manage Party Order for State</h2>

            <div className="form-group">
                <label htmlFor="stateSelect">Select State</label>
                <select id="stateSelect" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                    <option value="">Select a state</option>
                    {configData.states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>

            {selectedState && (
                <>
                    <div className="form-group">
                        <label htmlFor="partySelect">Select Party</label>
                        <select id="partySelect" value="" onChange={handlePartySelect}>
                            <option value="">Select a party</option>
                            {availableParties.map((party) => (
                                <option key={party} value={party}>
                                    {party}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="party-list">
                        {partyOrder.map((party, index) => (
                            <div
                                key={party}
                                className="party-item"
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(index)}
                            >
                                {party}
                                <button className="remove-btn" onClick={() => handleRemoveParty(party)}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="button" onClick={handleUpdateParties}>
                        Update Party Order
                    </button>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </>
            )}
        </div>
    );
};

export default PartyManagementTab;
