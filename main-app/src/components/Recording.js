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
    const mimeTypes = [
        'audio/webm',
        'audio/webm; codecs=opus',
        'audio/ogg; codecs=opus',
        'audio/mp4',
        'audio/aac',
        'audio/mp3',
        'audio/mpeg',
        'audio/mpga',
        'audio/m4a',
        'audio/wav',

      ];
      
      mimeTypes.forEach(mimeType => {
        console.log(`${mimeType}: ${MediaRecorder.isTypeSupported(mimeType)}`);
      });

    const handleAudioStop = (audioBlob, mimeType) => {
        const datetime = new Date().toLocaleString();
        const recording = {
            datetime,
            data: audioBlob,
            filename: `recording.${mimeType.split('/')[1]}`,// Use a static base name with dynamic extension
            type: mimeType // Store the MIME type
        };
        setLocalRecordings(prev => [...prev, recording]);
        setRecordingDuration(0);
    };

    const handleDeleteRecording = (index) => {
        setLocalRecordings(prev => prev.filter((_, i) => i !== index));
    };

    const startRecording = async () => {
        try {
            if( MediaRecorder.isTypeSupported('audio/webm') === false){
                alert("Safari sucks, use chrome or default iphone recorder and upload. This will semi work but transcription will be limited.")
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
                             MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' :
                             'audio/webm'; // Fallback to 'audio/webm'
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setErrorMessage('');

            const audioChunks = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                handleAudioStop(audioBlob, mimeType);
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
        const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
             // Check if file size exceeds the maximum limit
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage('Our free plan only allows 25MB transcriptions.');
                return;
            }
            if (/audio\/*/.test(file.type)) {
                const recording = {
                    datetime: new Date().toLocaleString(),
                    data: file,
                    filename: file.name, // Use original file name
                    type: file.type
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
                    filename: file.name, // Use original file name
                    type: file.type
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
            <h2>Conversation Analyzer</h2>
            <p className="instructions">
                Record, analyze, and extract actionable insights from conversations.
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="recording-controls">
                <button className="audio-control-btn" onClick={toggleRecording}>
                    <FaMicrophone />
                    <span>{isRecording ? 'Stop' : 'Record'}</span>
                </button>
                <input type="file" accept="audio/*,audio/mp4,audio/x-m4a" onChange={handleFileUpload} hidden id="audio-upload" />
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
                        <audio controls src={URL.createObjectURL(recording.data)} type={recording.type} />
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
