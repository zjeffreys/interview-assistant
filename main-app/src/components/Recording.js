import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import './Recording.css';

const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const animationContainer = useRef(null);
  const recordingInterval = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (animationContainer.current && isRecording) {
      const player = document.createElement('dotlottie-player');
      player.setAttribute('src', 'https://lottie.host/341277a8-afcf-456f-9f96-b72cfe783a43/6eINoorfkO.json');
      player.setAttribute('background', 'transparent');
      player.setAttribute('speed', '1');
      player.setAttribute('style', 'width: 50px; height: 50px;');
      player.setAttribute('loop', '');
      player.setAttribute('autoplay', '');
      animationContainer.current.innerHTML = '';
      animationContainer.current.appendChild(player);
    } else if (animationContainer.current) {
      animationContainer.current.innerHTML = '';
    }
  }, [isRecording]);

  const handleRecording = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(recordingInterval.current);
      const mockSummary = {
        timestamp: new Date().toLocaleString(),
        keypoints: "Key points from the interview",
        painpoints: "Identified pain points"
      };
      setRecordings([...recordings, mockSummary]);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="recording-section">
      <h2>Interview Recording</h2>
      <div className="recording-controls">
        <button className="button" onClick={handleRecording}>
          {isRecording 
            ? <div ref={animationContainer} className="animation-container"></div>
            : <FaMicrophone className="microphone-icon" />}
          <span className="recording-text">{isRecording ? 'Stop' : 'Start'} Interview</span>
          {isRecording && <div className="timer">{formatTime(recordingTime)}</div>}
        </button>
        
      </div>
      <div className="interview-summaries">
        <h3>Interview Summaries</h3>
        {recordings.map((recording, index) => (
          <div key={index} className="interview-summary">
            <p><strong>Timestamp:</strong> {recording.timestamp}</p>
            <p><strong>Key Points:</strong> {recording.keypoints}</p>
            <p><strong>Pain Points:</strong> {recording.painpoints}</p>
            </div>
            ))}
            </div>
            </div>
            );
            };
            
            export default Recording;

