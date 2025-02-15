import React, { useState } from 'react';
import UploadSanghTab from '../SanghPosts/UploadSanghTab';
import GetSanghPostsTab from '../SanghPosts/GetSanghPostsTab';
import DeleteSanghPostsTab from '../SanghPosts/DeleteSanghPostsTab';
import SanghListTab from '../SanghPosts/SanghListTab';

const SanghPostsTab = ({ configData }) => {
    const [activeSubTab, setActiveSubTab] = useState('upload'); // Default to the Upload sub-tab

    const renderPostSubTab = () => {
        switch (activeSubTab) {
            case 'upload':
                return <UploadSanghTab configData={configData} />;
            case 'sanghList':
                return <SanghListTab configData={configData} />;
            case 'order':
                return <GetSanghPostsTab configData={configData} />;
            case 'delete':
                return <DeleteSanghPostsTab configData={configData} />;
            default:
                return null;
        }
    };

    return (
        <div>
            {/* <div className="sub-tabs">
                <button className={`tab-item ${activeSubTab === 'upload' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('upload')}>
                    Upload
                </button>
                <button className={`tab-item ${activeSubTab === 'sanghList' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('sanghList')}>
                    Order & Delete Sangh Posts
                </button>
                <button className={`tab-item ${activeSubTab === 'order' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('order')}>
                    Get Sangh Posts
                </button>
                <button className={`tab-item ${activeSubTab === 'delete' ? 'active-tab' : ''}`} onClick={() => setActiveSubTab('delete')}>
                    Delete Posts
                </button>
            </div>
            <div className="tab-content">
                {renderPostSubTab()}
            </div> */}
             <SanghListTab configData={configData}/>
        </div>
    );
};

export default SanghPostsTab;
