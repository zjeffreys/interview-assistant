import React, { useState, useEffect } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { FaTrash } from 'react-icons/fa';
import ReactSwitch from 'react-switch';
import './Recording.css';

const Recording = ({ getRecordings }) => {
    const [localRecordings, setLocalRecordings] = useState([]);
    const [demoMode, setDemoMode] = useState(false);
    const [selectedDemoRecording, setSelectedDemoRecording] = useState("");
    const demoRecordings = ['club-owner-interview.mp3']; // List of demo recordings
    //const demoRecordings = ['demo1.mp3', 'demo2.mp3', 'demo3.mp3']; // List of demo recordings


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

    const handleDemoRecordingSelect = async (file) => {
        setSelectedDemoRecording(file);
        const response = await fetch(`./audio/${file}`);
        const blob = await response.blob();
        const recording = {
            datetime: new Date().toLocaleString(),
            data: blob, 
            fileName: file // Storing the filename
        };
        setLocalRecordings(prev => [...prev, recording]);
    };

    useEffect(() => {
        getRecordings(localRecordings);
    }, [localRecordings, getRecordings]);

    return (
        <div className="recording-section">
            <h2>Interview Recording</h2>
            <div className="recording-controls">
                <div className="switch-container">
                    <ReactSwitch 
                        checked={!demoMode}
                        onChange={checked => {
                            setDemoMode(!checked);
                            setSelectedDemoRecording("");
                        }}
                        id="react-switch"
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                    />
                    <label htmlFor="react-switch" className="switch-label">Use Microphone</label>
                </div>
                {demoMode ? (
                    <div className="demo-dropdown">
                        <select 
                            id="demoSelect"
                            onChange={e => handleDemoRecordingSelect(e.target.value)}
                            value={selectedDemoRecording}
                        >
                            <option value="">Example Recordings</option>
                            {demoRecordings.map((file, index) => (
                                <option key={index} value={file}>
                                    {file}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <AudioRecorder 
                        onRecordingComplete={handleAudioStop}
                        showVisualizer={true}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }} 
                        downloadFileExtension="webm"
                    />
                )}
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
