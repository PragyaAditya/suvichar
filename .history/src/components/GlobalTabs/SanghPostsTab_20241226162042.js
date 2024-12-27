import React, { useState } from 'react';
import UploadTab from '../Posts/UploadTab';
import OrderPostsTab from '../Posts/OrderPostsTab';
import DeletePostsTab from '../Posts/DeletePostsTab';

const SanghPostsTab = ({ configData }) => {
    const [activeSubTab, setActiveSubTab] = useState('upload'); // Default to the Upload sub-tab

    const renderPostSubTab = () => {
        switch (activeSubTab) {
            case 'upload':
                return <UploadTab configData={configData} />;
            case 'order':
                return <OrderPostsTab configData={configData} />;
            case 'delete':
                return <DeletePostsTab configData={configData} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="sub-tabs">
                <button className={`tab-item ${activeSubTab === 'upload' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('upload')}>
                    Upload
                </button>
                <button className={`tab-item ${activeSubTab === 'order' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('order')}>
                    Get Bhagwan Posts
                </button>
                <button className={`tab-item ${activeSubTab === 'delete' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('delete')}>
                    Delete Posts
                </button>
            </div>
            <div className="tab-content">
                {renderPostSubTab()}
            </div>
        </div>
    );
};

export default SanghPostsTab;
