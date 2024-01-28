import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './HeroSection.css';

function HeroSection() {
  const navigate = useNavigate();

  const navigateToDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="hero-section">
      <div className="left-column">
        <h1>
          Data Mine <span className="gradient-text">Insights</span> from Discussions
        </h1>
        <p className="subheader">
          Transform your customer interviews into actionable data with our AI-powered analysis tool. Dive deep into conversations and uncover valuable insights.
        </p>
        <button className="try-now-button" onClick={navigateToDemo}>Try Now</button>
        <p className="small-text">No credit card required</p>
      </div>
      <div className="right-column">
        <img src="/infographic2.png" alt="Infographic" className="faded-image" />
      </div>
    </div>
  );
}

export default HeroSection;
