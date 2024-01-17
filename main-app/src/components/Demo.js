import React, { useState } from 'react';
import './Demo.css';
import testData from './testing.json'
import InterviewQuestions from './InterviewQuestions';
import ParentComponent from './ParentComponent';

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
         <input  className="questionsInput" placeholder='What is this interview about?'/>
          <button className="button" onClick={generateQuestions}>Generate Interview Questions</button>
        </div>
      )}

      {questions && ( // Render this section only if questions are not empty
        <InterviewQuestions></InterviewQuestions>
      )}
        <ParentComponent></ParentComponent>
      
    </div>
  );
}

export default Demo;
