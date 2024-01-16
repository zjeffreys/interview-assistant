import React, { useState, useEffect } from 'react';
import interviewData from './testing.json'; // Adjust the path as needed
import './InterviewQuestions.css'

const InterviewQuestions = () => {
  const questions = interviewData.interview_questions.map(q => q.question);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  function type() {
    if (!isTypingComplete) {
      const currentQuestion = questions[questionIndex];
      setText(current => current + currentQuestion.charAt(current.length));

      if (text === currentQuestion) {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(questionIndex + 1);
          setText('');
        } else {
          setIsTypingComplete(true);
        }
      }
    }
  }

  useEffect(() => {
    if (!isTypingComplete) {
      const timer = setTimeout(type, 20); // Speed up the typing effect
      return () => clearTimeout(timer);
    }
  }, [text, questionIndex, isTypingComplete]);

  return (
    <div className="interview-questions-container">
      <h2>Intelligent Interview Questions</h2>
      <p>Here are is questions for a 20 minute interview. This is intended to aid you in asking effective open-ended questions.</p>
        <div className='questions-container'>
        {questions.slice(0, questionIndex + 1).map((question, index) => (
            <p key={index} className="question">{index === questionIndex ? text : question}</p>
        ))}
        </div>
    </div>
  );
};

export default InterviewQuestions;
