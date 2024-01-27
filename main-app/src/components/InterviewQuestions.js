import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import interviewData from './testing.json'; // Ensure this has the correct structure
import './InterviewQuestions.css';

const InterviewQuestions = () => {
  const [interviewInfo, setInterviewInfo] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);

  const handleInputChange = (event) => {
    setInterviewInfo(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const generateQuestions = async () => {
    console.log('generating questions');
    let newQuestions;
    if (showInput) {
      try {
        const formData = new URLSearchParams();
        formData.append('user_input', interviewInfo);
        
        const response = await fetch('https://nv2lio7ckbucjkeujfc4bn7ufm0zoptl.lambda-url.us-west-2.on.aws/getInterviewQuestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        const data = await response.json();
        if (data && data.response && data.response.interview_questions) {
          console.log(data.response);
          newQuestions = data.response.interview_questions.map(q => q.question);
        } else {
          newQuestions = [];
          console.error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        newQuestions = [];
      }
    } else {
      newQuestions = interviewData.response.interview_questions.map(q => q.question);
    }

    setQuestions(newQuestions);
    setDisplayedQuestions([]);
    setTypingIndex(0);
  };

  useEffect(() => {
    if (typingIndex < questions.length) {
      const timer = setTimeout(() => {
        setDisplayedQuestions(displayedQuestions => [...displayedQuestions, questions[typingIndex]]);
        setTypingIndex(typingIndex + 1);
      }, 500); // Adjust time as needed for typing speed
      return () => clearTimeout(timer);
    }
  }, [typingIndex, questions]);

  return (
    <div className="interview-questions-container">
      <div className="input-section">
        <div>
          <h2>Craft Interview Questions</h2>
          <p>Tell me about your interview goals and I'll help you draft effective interview questions.</p>

          <label className="toggle-switch">
            <ReactSwitch 
              checked={showInput}
              onChange={setShowInput}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
            />
            <span>{showInput ? ' AI On' : ' AI Off'}</span>
          </label>
          <select value={selectedOption} onChange={handleSelectChange}>
                <option value="">Choose Interview Type</option>
                <option value="option1">Problem Solution Fit</option>
                <option value="option2">Product Feature</option>
                <option value="option3">Other</option>
                {/* Add more options as needed */}
              </select>

          {showInput && (
            <>
              
              <input
                className="questionsInput"
                placeholder='What is this interview about?'
                value={interviewInfo}
                onChange={handleInputChange}
              />
            </>
          )}
        </div>
        <button className="button" onClick={generateQuestions}>Generate Interview Questions</button>
      </div>

      <div className='questions-container'>
        {displayedQuestions.map((question, index) => (
          <p key={index} className="question">{question}</p>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;
