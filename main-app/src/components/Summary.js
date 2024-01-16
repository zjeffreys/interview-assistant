import React, { useState } from 'react';
import { FaShareSquare, FaBrain } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Summary.css';

const Summary = ({ recordings, onDeleteRecording }) => {
    const [showAISummary, setShowAISummary] = useState(false);

    const data = [
        { name: 'Topic A', value: 400 },
        { name: 'Topic B', value: 300 },
        { name: 'Topic C', value: 300 },
        { name: 'Topic D', value: 200 },
    ];

    const handleSummarize = () => {
        setShowAISummary(true);
    };

    return (
        <div className="interview-summaries">
            <h3>Recordings</h3>
            <div className="summary-table">
                {recordings.map((recording, index) => {
                    const audioUrl = recording.data ? URL.createObjectURL(recording.data) : null;

                    return (
                        <div key={index} className="interview-summary">
                            <p><strong>Timestamp:</strong> {recording.timestamp}</p>
                            {audioUrl && (
                                <>
                                    <audio controls>
                                        <source src={audioUrl} type="audio/webm" />
                                        Your browser does not support the audio element.
                                    </audio>
                                    <a href={audioUrl} download={`Recording-${recording.timestamp}.webm`} className="icon-button">
                                        <FaShareSquare />
                                    </a>
                                    <button onClick={() => onDeleteRecording(index)} className="icon-button">
                                        <FaBrain />
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {recordings.length > 0 && (
                <button className="summarize-button button" onClick={handleSummarize}>Summarize Interview</button>
            )}
            {showAISummary && (
                <div className="ai-summary">
                    <h4>AI Summary of the Interview</h4>
                    <p>Here's a summary of the key points and data from the interview:</p>
                    {/* <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart> */}
                    <button className="save-results-button">Save Results</button>
                </div>
            )}
        </div>
    );
};

export default Summary;
