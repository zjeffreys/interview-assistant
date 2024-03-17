import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import './Summary.css';
import JsonDisplay from './JsonDisplay';

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
            try {
                const now = new Date();
                const datetime = now.toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
                const key = `raw_audio/${datetime}_${recording.filename}`
                const encodedKey = encodeURIComponent(key);
                const encodedContentType = encodeURIComponent(recording.data.type)            
                const response = await fetch(`https://nv2lio7ckbucjkeujfc4bn7ufm0zoptl.lambda-url.us-west-2.on.aws/generate-presigned-url?object_name=${encodedKey}&content_type=${encodedContentType}`);
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }               
                const res = await response.json(); // Parse the JSON response
                const url = res.signed_url

                // Use the pre-signed URL to upload the file directly to S3            
                await fetch(url, {
                    method: 'PUT',
                    body: recording.data,
                    headers: {
                        'Content-Type': recording.type, // This sets the Content-Type header to the file's MIME type
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }).catch(error => {
                    console.error('Upload error:', error);
                });

                console.log('Upload successful');

                const formData = new FormData();
                formData.append('bucket', 'my-interview-bucket'); // Update with actual bucket name if different
                formData.append('key', key);

                // Call your REST API Lambda function for transcription
                const apiResponse = await fetch('https://nv2lio7ckbucjkeujfc4bn7ufm0zoptl.lambda-url.us-west-2.on.aws/transcribe_audio', {
                    method: 'POST',
                    body: formData,
                });
                
                const data = await apiResponse.json(); // Return transcript
                console.log(data)

                // Handle your response
                if (data.transcript) {
                    combinedTranscription += `${data.transcript}\n\n`;
                    setFileName(recording.filename);
                } else {
                    console.error('No transcript received for:', recording.filename);
                }
            } catch (error) {
                console.error('Error during upload or transcription:', error);
            }
        }

        setTranscriptionText(combinedTranscription);
        setShowSummary(true);
        onSummaryGenerated();
        setLoading(false);
    };

    return (
        <div className="interview-summaries">
            {!showSummary && (
                <button
                    onClick={handleSummarizeClick}
                    style={{ display: 'block', margin: '10px auto' }}
                >
                    Process Audio
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
                    {/* <h3>Interview Summary</h3> */}
                    {/* <div className="recordings-section">
                        {recordings.map((recording, index) => (
                            <div key={index}>
                                <audio controls src={URL.createObjectURL(recording.data)} type="audio/webm" />
                            </div>
                        ))}
                    </div> */}

                    <h3>Transcription</h3>
                    <div className="transcription-section" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        <p>{transcriptionText}</p>
                    </div>

                    {/* <h3>Business Insights</h3> */}
                    <div className="summary-section">
                        <JsonDisplay filename={filename} text={transcriptionText} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Summary;
