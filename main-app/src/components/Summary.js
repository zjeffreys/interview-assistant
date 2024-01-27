import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Importing a spinner icon from react-icons
import './Summary.css';
import JsonDisplay from './JsonDisplay'; // Adjust the path based on your file structure


const Summary = ({ recordings, onFetchRecordings, onSummaryGenerated }) => {
    const [showSummary, setShowSummary] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [filename, setFileName] = useState('');


    useEffect(() => {
        onFetchRecordings();
    }, [onFetchRecordings]);

    const handleSummarizeClick = async () => {
        setLoading(true);
        let combinedTranscription = '';

        for (const recording of recordings) {
            const formData = new FormData();
            // formData.append('audio_file', recording.data, 'recording.webm');
            formData.append('audio_file', recording.data, recording.fileName || 'recording.webm');
            setFileName(recording.fileName || 'recording.webm')
            try {
                const response = await fetch('http://localhost:8000/transcribe_audio', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                combinedTranscription += data.transcript + '\n\n';
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setTranscriptionText(combinedTranscription);
        setShowSummary(true);
        onSummaryGenerated();
        setLoading(false);
    };

    const isButtonDisabled = recordings.length === 0;

    return (
        <div className="interview-summaries">
            {!showSummary && (
                <button 
                    onClick={handleSummarizeClick} 
                    style={{ display: 'block', margin: '10px auto' }} 
                    disabled={isButtonDisabled}
                >
                    Summarize Interview
                </button>
            )}

            {loading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <FaSpinner className="spinner" />
                    <p>Transcribing audio to text...</p>
                </div>
            )}

            {!loading && showSummary && (
                <>
                    <h3>Interview Summary</h3>
                    <div className="recordings-section">
                        {recordings.map((recording, index) => (
                            <div key={index}>
                                <strong>Time:</strong> {recording.datetime} <br />
                                <audio controls src={URL.createObjectURL(recording.data)} type="audio/webm" />
                            </div>
                        ))}
                    </div>

                    <h3>Transcription</h3>
                    <div className="transcription-section" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        <p>{transcriptionText}</p>
                    </div>

                    <h3>Business Insights</h3>
                    <div className="summary-section" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                    <JsonDisplay filename={filename} text={transcriptionText} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Summary;
