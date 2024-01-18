import React, { useState } from 'react';
import Recording from './Recording';
import Summary from './Summary';

const ParentComponent = () => {
    const [recordings, setRecordings] = useState([]);
    const [summaryGenerated, setSummaryGenerated] = useState(false);

    const getRecordingsFromRecordingComponent = (currentRecordings) => {
        setRecordings(currentRecordings);
    };

    const handleSummaryGenerated = () => {
        setSummaryGenerated(true);
    };

    return (
        <div>
            {!summaryGenerated && (
                <Recording getRecordings={getRecordingsFromRecordingComponent} />
            )}
            <Summary 
                recordings={recordings} 
                onFetchRecordings={() => {}} // Placeholder for any additional fetching logic if needed
                onSummaryGenerated={handleSummaryGenerated} 
            />
        </div>
    );
};

export default ParentComponent;
