import { useState, useEffect } from "react";

const useFilteredData = (statesData, configData) => {
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredParties, setFilteredParties] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);

    useEffect(() => {
        setFilteredStates(statesData.filter(item =>
            configData?.states.includes(item.state.replace(' ', '_'))
        ) || []);
        setFilteredParties(configData?.parties || []);
    }, [configData]);

    // Handle Language Change
    const handleLanguageChange = (value) => {
        setSelectedLanguage(value);
        setSelectedState(null);
        setSelectedParty(null);

        if (!value) {
            // Show all states from configData if no language is selected
            setFilteredStates(statesData.filter(item =>
                configData?.states.includes(item.state.replace(' ', '_'))
            ));
            setFilteredParties(configData?.parties || []);
            return;
        }

        // Filter states based on the selected language
        const filteredStatesList = statesData
            .filter(item => item.language.toUpperCase() === value?.toUpperCase())
            .filter(item => configData?.states.includes(item.state.replace(' ', '_')));
        
        setFilteredStates(filteredStatesList);

        // Filter parties based on selected language
        const partiesList = filteredStatesList.flatMap(item => item.parties);
        setFilteredParties(configData?.parties.filter(party => partiesList.includes(party)));
    };

    // Handle State Change
    const handleStateChange = (value) => {
        setSelectedState(value);
        setSelectedParty(null);

        if (!value) {
            setFilteredParties(configData?.parties || []);
            return;
        }

        const selectedStateData = statesData.find(item => item.state === value);
        setFilteredParties(selectedStateData?.parties.filter(party => configData?.parties.includes(party)) || []);
    };

    return {
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
    };
};

export default useFilteredData;
