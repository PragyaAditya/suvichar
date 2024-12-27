import apiClient from './apiService'; // Import the apiClient from apiService

// Function to fetch the configuration data
export const fetchConfig = async () => {
    try {
        const response = await apiClient.get('/config/v1/config',{
            params:{
                consistent : true
             }
        }); // Use apiClient without redefining headers
        return response.data; // Return the config data
    } catch (error) {
        console.error('Error fetching config:', error);
        throw error; // Handle the error as needed
    }
};

export const updateActiveGateways = async (gateways) => {
    return await apiClient.put('config/v1/config/gateway', null, {
        params: {
            gateways: gateways.join(','),
        },
    });
};

export const updateStateOrder = async (packageName, states) => {
    try {
        const response = await apiClient.put('/config/v1/config/states', null, {
            params: {
                packageName,
                states: states.join(','),
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating state order');
    }
};

export const updatePartyOrder = async (state, partyOrder) => {
    try {
        const response = await apiClient.put('/config/v1/config/party/order', {
            state: state,
            partyOrder: partyOrder//.join(','),
        });
        return response.data;
    } catch (error) {
        console.error('Error updating party order:', error);
        throw error;
    }
};

export const updateLeaders = async (state, party, partyLeaders) => {
    const payload = {
        state,
        party,
        partyLeaders,
    };

    return apiClient.put('/config/v1/config/party/leaders', payload);
};

