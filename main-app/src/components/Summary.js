import React, { useState } from 'react';
import { FaUserAlt, FaTasks, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import './Summary.css';
import summaryData from './summary.json';

const Summary = ({ onFetchRecordings }) => {
    const [showSummary, setShowSummary] = useState(false);

    const toggleSummary = () => {
        setShowSummary(!showSummary);
    };

    return (
        <div className="interview-summaries">
            <h3 style={{ textAlign: 'center' }}>Interview Summary</h3>
            {/* <button onClick={onFetchRecordings}>Process Recordings</button> */}
            <button onClick={toggleSummary} style={{ display: 'block', margin: '10px auto' }}>
                {showSummary ? 'Hide Summary' : 'Summarize With AI'}
            </button>

            {showSummary && (
                <>
                    <div className="summary-section">
                        <FaUserAlt className="icon" />
                        <div className="section-content">
                            <h4>{summaryData.persona_summary.name}</h4>
                            <p>Profession: {summaryData.persona_summary.profession}</p>
                            <p>Experience: {summaryData.persona_summary.experience}</p>
                        </div>
                    </div>

                    <div className="summary-section">
                        <FaTasks className="icon" />
                        <div className="section-content">
                            <h5>Main Responsibilities</h5>
                            <ul>
                                {summaryData.persona_summary.responsibilities.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="summary-section">
                        <FaQuestionCircle className="icon" />
                        <div className="section-content">
                            <h5>Challenges</h5>
                            <ul>
                                {summaryData.customer_insights.challenges.map((challenge, index) => (
                                    <li key={index}>{challenge}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="summary-section">
                        <FaLightbulb className="icon" />
                        <div className="section-content">
                            <h5>Potential AI Benefits</h5>
                            <ul>
                                {summaryData.customer_insights.potential_ai_benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center' }}><strong>Attitude Towards Innovation:</strong> {summaryData.customer_insights.attitude_towards_innovation}</p>
                </>
            )}
        </div>
    );
};

export default Summary;
