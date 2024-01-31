import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaMicrophone, FaUpload } from 'react-icons/fa';
import './Recording.css';

const Recording = ({ getRecordings }) => {
    const [localRecordings, setLocalRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);

    const handleAudioStop = (audioBlob) => {
        const datetime = new Date().toLocaleString();
        const recording = {
            datetime,
            data: audioBlob,
            filename: `recording-${datetime.replace(/[\W_]+/g, '-')}.webm` // Create a unique filename
        };
        setLocalRecordings(prev => [...prev, recording]);
        setRecordingDuration(0);
    };

    const handleDeleteRecording = (index) => {
        setLocalRecordings(prev => prev.filter((_, i) => i !== index));
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setErrorMessage('');

            const audioChunks = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                handleAudioStop(audioBlob);
                stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
            };

            recordingIntervalRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } catch (error) {
            setErrorMessage('Error accessing microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (/audio\/*/.test(file.type)) {
                const recording = {
                    datetime: new Date().toLocaleString(),
                    data: file,
                    filename: file.name // Use original file name
                };
                setLocalRecordings(prev => [...prev, recording]);
                setErrorMessage('');
            } else {
                setErrorMessage('Please upload a valid audio file.');
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (/audio\/*/.test(file.type)) {
                const recording = {
                    datetime: new Date().toLocaleString(),
                    data: file,
                    fileName: file.name // Use original file name
                };
                setLocalRecordings(prev => [...prev, recording]);
                setErrorMessage('');
            } else {
                setErrorMessage('Please drop a valid audio file.');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        getRecordings(localRecordings);
    }, [localRecordings, getRecordings]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="recording-section">
            <h2>Audio Recorder and Uploader</h2>
            <p className="instructions">
                Click the microphone to start recording. Click again to stop. Or drag and drop an audio file, or click the upload button to select a file.
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="recording-controls">
                <button className="audio-control-btn" onClick={toggleRecording}>
                    <FaMicrophone />
                    <span>{isRecording ? 'Stop' : 'Record'}</span>
                </button>
                <input type="file" accept="audio/*" onChange={handleFileUpload} hidden id="audio-upload" />
                <label htmlFor="audio-upload" className="audio-control-btn">
                    <FaUpload />
                    <span>Upload</span>
                </label>
            </div>
            {isRecording && <p className="recording-timer">Recording: {formatDuration(recordingDuration)}</p>}
            <div className="recordings-table" onDrop={handleDrop} onDragOver={handleDragOver}>
                {localRecordings.map((recording, index) => (
                    <div key={index} className="recording-row">
                        <span>{recording.datetime.split(',')[1]}</span>
                        <audio controls src={URL.createObjectURL(recording.data)} type="audio/webm" />
                        <button onClick={() => handleDeleteRecording(index)} className="delete-button">
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recording;
