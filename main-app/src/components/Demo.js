import React, { useState } from 'react';
import './Demo.css';

function Demo() {
  const [interviewInfo, setInterviewInfo] = useState('');
  const [questions, setQuestions] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');


  const handleInputChange = (event) => {
    setInterviewInfo(event.target.value);
  };

  const generateQuestions = async () => {
    // Placeholder for actual API call
    const mockQuestions = `1. What inspired you to start this project?\n2. How does your solution stand out in the market?\n...`; // Add more mock questions
    setQuestions(mockQuestions);
    setShowDetails(false); // Hide Interview Details section
  };

  return (
    <div className="demo-container">
      {showDetails && (
        <div className="input-section">
          <h2>Craft Interview Questions</h2>
          <p>Tell me about your interview goals and i'll help you draft effective interview questions.</p>
          <select value={selectedOption} onChange={(e) => (e.target.value)}>
            <option value="">Choose Interview Type</option>
            <option value="option1">Problem Solution Fit</option>
            <option value="option2">Product Feature</option>
            <option value="option3">Other</option>

            {/* Add more options as needed */}
        </select>
          <textarea
            value={interviewInfo}
            onChange={handleInputChange}
            placeholder="Enter details about the interviewee or topic..."
          />
          <button className="button" onClick={generateQuestions}>Generate Interview Questions</button>
        </div>
      )}

      {questions && ( // Render this section only if questions are not empty
        <div className="output-section">
          <h2>Generated Interview Questions</h2>
          <div className="questions">
            <pre>{questions}</pre>
          </div>
        </div>
      )}

      <div className="recording-section">
        <h2>Interview Recording</h2>
        <button className="button">Start Recording</button>
        <div className="interview-summary">
          <h3>Interview Summary</h3>
          {/* Add components or content for the interview summary here */}
        </div>
      </div>
    </div>
  );
}

export default Demo;
