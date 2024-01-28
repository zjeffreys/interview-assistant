import React, { useState, useEffect } from 'react';
import { FaTrash, FaMicrophone, FaUpload } from 'react-icons/fa';
import './Recording.css';

const Recording = ({ getRecordings }) => {
    const [localRecordings, setLocalRecordings] = useState([]);

    const handleAudioStop = (data) => {
        const recording = {
            datetime: new Date().toLocaleString(),
            data: data
        };
        setLocalRecordings(prev => [...prev, recording]);
    };

    const handleDeleteRecording = (index) => {
        setLocalRecordings(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        getRecordings(localRecordings);
    }, [localRecordings, getRecordings]);

    return (
        <div className="recording-section">
            <h2>Upload Audio</h2>
            <p className="instructions">
                Record or upload your discussions for analysis. Click on the microphone to start recording or use the upload button to add an audio file.
            </p>
            <div className="recording-controls">
                {/* Add functionality to record and upload buttons as per your requirement */}
                <button className="audio-control-btn">
                    <FaMicrophone />
                    <span>Record</span>
                </button>
                <button className="audio-control-btn">
                    <FaUpload />
                    <span>Upload</span>
                </button>
            </div>
            <div className="recordings-table">
                {localRecordings.map((recording, index) => (
                    <div key={index} className="recording-row">
                        <span>{recording.datetime.split(',')[1]}</span>
                        <audio controls src={URL.createObjectURL(recording.data)} type="audio/webm" />
                        <button onClick={() => handleDeleteRecording(index)} className="delete-button">
                            <FaTrash/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recording;
