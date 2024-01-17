import React, { useState, useEffect } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { FaTrash } from 'react-icons/fa';
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
            <h2>Interview Recording</h2>
            <div className="recording-controls">
                <AudioRecorder 
                    onRecordingComplete={handleAudioStop}
                    showVisualizer={true}
                    audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                    }} 
                    downloadFileExtension="webm"
                />
            </div>
            <div className="recordings-table">
                {localRecordings.map((recording, index) => (
                    <div key={index} className="recording-row">
                        {/* <span>{recording.datetime}</span> */}
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
