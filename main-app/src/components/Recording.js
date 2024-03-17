import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import './Recording.css';

const Recording = ({ getRecordings }) => {
    const [localRecordings, setLocalRecordings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
        getRecordings(localRecordings);
    }, [localRecordings, getRecordings]);

    return (
        <div className="recording-section">
            <h2>Zosimos</h2>
            <p className="instructions">
                Upload Customer Interviews |
                Datamine Insights | 
                Share With Team 
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="recording-controls">
                <input type="file" accept="audio/*,audio/mp4,audio/x-m4a" onChange={handleFileUpload} hidden id="audio-upload" />
                <label htmlFor="audio-upload" className="audio-control-btn">
                    <FaUpload />
                    <span>Upload</span>
                </label>
            </div>
          
        </div>
    );
};

export default Recording;
