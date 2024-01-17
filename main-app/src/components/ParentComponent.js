import React, { useState } from 'react';
import Recording from './Recording';
import Summary from './Summary';

const ParentComponent = () => {
    const [recordings, setRecordings] = useState([]);
    const [finalRecordings, setFinalRecordings] = useState([]);

    const getRecordingsFromRecordingComponent = (currentRecordings) => {
        setRecordings(currentRecordings);
    };

    const handleProcessRecordings = () => {
        setFinalRecordings(recordings);
    };

    return (
        <div>
            <Recording getRecordings={getRecordingsFromRecordingComponent} />
            <Summary recordings={finalRecordings} onFetchRecordings={handleProcessRecordings} />
        </div>
    );
};

export default ParentComponent;
