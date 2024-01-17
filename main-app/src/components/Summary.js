import React, { useState } from 'react';
import { FaUserAlt, FaTasks, FaQuestionCircle, FaLightbulb, FaSpinner } from 'react-icons/fa';
import './Summary.css';
import summaryData from './summary.json';

const Summary = () => {
    const [showSummary, setShowSummary] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSummarizeClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowSummary(true);
        }, 3000); // 3 seconds delay
    };

    return (
        <div className="interview-summaries">
            <h3 style={{ textAlign: 'center' }}>Interview Summary</h3>
            {!showSummary && (
                <button onClick={handleSummarizeClick} style={{ display: 'block', margin: '10px auto' }}>
                    Summarize With AI
                </button>
            )}

            {loading && <FaSpinner className="spinner" />}

            {!loading && showSummary && (
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
                    <button>Email Results</button>
                    <button>Save</button>

                </>
            )}
        </div>
    );
};

export default Summary;
