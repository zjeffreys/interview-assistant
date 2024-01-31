import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Importing a spinner icon from react-icons
import './Summary.css';
import JsonDisplay from './JsonDisplay'; // Adjust the path based on your file structure

// const response = await fetch('https://nv2lio7ckbucjkeujfc4bn7ufm0zoptl.lambda-url.us-west-2.on.aws/transcribe_audio', {

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
            formData.append('audio_file', recording.data, recording.filename);

            try {
                const response = await fetch('http://localhost:8000/transcribe_audio', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.transcript) {
                    combinedTranscription += `${data.transcript}\n\n`;
                    setFileName(recording.filename); // Update filename for each recording
                } else {
                    console.error('No transcript received for:', recording.filename);
                }
            } catch (error) {
                console.error('Error during transcription:', error);
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
                    <div className="summary-section" >
                    <JsonDisplay filename={filename} text={transcriptionText} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Summary;
