import React, {useState} from 'react';
import ManageAdminTab from "../Admin/ManageAdminTab";
import NewAdminTab from "../Admin/NewAdminTab";

const ConfigTabs = ({configData, setConfigData}) => {
    const [activeSubTab, setActiveSubTab] = useState('admins'); // Default to the Upload sub-tab

    const renderConfigSubTab = () => {
        switch (activeSubTab) {
            case 'admins':
                return <ManageAdminTab/>;
            case 'new-admins':
                return <NewAdminTab/>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="sub-tabs">
                <button className={`tab-item ${activeSubTab === 'admins' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('admins')}>
                    Admin Details
                </button>
                <button className={`tab-item ${activeSubTab === 'new-admins' ? 'active-tab' : ''}`}
                        onClick={() => setActiveSubTab('new-admins')}>
                    New Admin
                </button>
            </div>
            <div className="tab-content">
                {renderConfigSubTab()}
            </div>

        </div>
    );
};

export default ConfigTabs;
