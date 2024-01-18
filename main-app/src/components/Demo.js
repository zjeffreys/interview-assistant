import React from 'react';
import './Demo.css';
import InterviewQuestions from './InterviewQuestions';
import ParentComponent from './ParentComponent';

function Demo() {
  return (
    <div className="demo-container">
      <InterviewQuestions />
      <ParentComponent />
    </div>
  );
}

export default Demo;
