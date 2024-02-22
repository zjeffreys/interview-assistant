import React, { useState } from 'react';
import Recording from './Recording';
import Summary from './Summary';
import './ParentComponent.css';

const ParentComponent = () => {
    const [recordings, setRecordings] = useState([]);
    const [summaryGenerated, setSummaryGenerated] = useState(false);

    const getRecordingsFromRecordingComponent = (recordingData) => {
        setRecordings(recordingData);
        // Assuming recordingData is an array, check if it's not empty to set summaryGenerated
        if (recordingData.length > 0) {
            setSummaryGenerated(true);
        } else {
            setSummaryGenerated(false);
        }
    };

    const handleSummaryGenerated = (summaryData) => {
        // Handle summary generation logic
        setSummaryGenerated(true);
    };

    return (
        <div className='parentContainer'>
            {!summaryGenerated && (
                <Recording getRecordings={getRecordingsFromRecordingComponent} />
            )}
            {summaryGenerated && recordings.length > 0 && (
                <Summary 
                    recordings={recordings} 
                    onFetchRecordings={() => {}} // Placeholder for any additional fetching logic if needed
                    onSummaryGenerated={handleSummaryGenerated} 
                />
            )}
        </div>
    );
};

export default ParentComponent;
