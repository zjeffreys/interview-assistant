// ParentComponent.js
import React, { useState } from 'react';
import Recording from './Recording';
import Summary from './Summary'; // Renamed component

const ParentComponent = () => {
    const [recordings, setRecordings] = useState([]);

    const handleStopRecording = (audioData) => {
        setRecordings(prevRecordings => [...prevRecordings, audioData]);
    };

    const handleDeleteRecording = (index) => {
        setRecordings(prevRecordings => prevRecordings.filter((_, i) => i !== index));
    };

    return (
        <div>
            <Recording onStopRecording={handleStopRecording} />
            <Summary recordings={recordings} onDeleteRecording={handleDeleteRecording} /> {/* Renamed component */}
        </div>
    );
};

export default ParentComponent;
