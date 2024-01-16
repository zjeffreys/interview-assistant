// Recording.js
import React, { useState } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import './Recording.css';

const Recording = ({ onStopRecording }) => {
    const handleAudioStop = (data) => {
        const recording = {
            timestamp: new Date().toLocaleString(),
            data: data
        };
        console.log(recording)
        onStopRecording(recording);
    };

 
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
                // downloadOnSavePress={true}
                downloadFileExtension="webm"
            />
            
            </div>
        </div>
    );
};

export default Recording;
