import React, {useState} from 'react';
import ActiveGatewaysTab from '../Config/ActiveGatewaysTab';
import StateManagementTab from "../Config/StateManagementTab";
import PartyManagementTab from "../Config/PartyManagementTab";
import LeadersManagementTab from "../Config/LeadersManagementTab";

const ConfigTabs = ({configData, setConfigData}) => {
    const [activeSubTab, setActiveSubTab] = useState('gateways'); // Default to the Upload sub-tab

    const renderConfigSubTab = () => {
        switch (activeSubTab) {
            case 'gateways':
                return <ActiveGatewaysTab configData={configData}/>;
            case 'state':
                return <StateManagementTab configData={configData}/>;
            case 'party':
                return <PartyManagementTab configData={configData} setConfigData={setConfigData}/>;
            case 'leaders':
                return <LeadersManagementTab configData={configData} setConfigData={setConfigData}/>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="sub-tabs">
                <button className={`tab-item ${activeSubTab === 'gateways' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('gateways')}>
                    Active Gateways
                </button>
                <button className={`tab-item ${activeSubTab === 'state' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('state')}>
                    States
                </button>
                <button className={`tab-item ${activeSubTab === 'party' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('party')}>
                    Parties
                </button>
                <button className={`tab-item ${activeSubTab === 'leaders' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('leaders')}>
                    Leaders
                </button>
            </div>
            <div className="tab-content">
                {renderConfigSubTab()}
            </div>

        </div>
    );
};

export default ConfigTabs;
