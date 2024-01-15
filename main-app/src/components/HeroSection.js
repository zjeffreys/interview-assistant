import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FaQuestion, FaBrain, FaShareSquare } from 'react-icons/fa';
import '../App.css';
import './HeroSection.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate


function HeroSection() {
  const navigate = useNavigate(); // Hook to navigate

  const navigateToDemo = () => {
    navigate('/demo'); // Navigate to /demo route
  };

  return (
    <div className="hero-section">
      <h1>AI Customer Interview Assistant</h1>
      <Carousel showArrows={true} emulateTouch={true} infiniteLoop={true} autoPlay={true} interval={5000}>
        <div className="feature">
          <FaQuestion size={60} className="feature-icon" />
          <h2 className="feature-title">AI-Powered Questioning</h2>
          <p>Delve into customer needs with precision-crafted, intelligent questions.</p>
        </div>
        <div className="feature">
          <FaBrain size={60} className="feature-icon" />
          <h2 className="feature-title">Datamine Interview Insights</h2>
          <p>Our AI analyzes each interview and identifies trends across customer segments.</p>
        </div>
        <div className="feature">
          <FaShareSquare size={60} className="feature-icon" />
          <h2 className="feature-title">Streamlined Sharing</h2>
          <p>Effortlessly share insights with your team, board, and investors.</p>
        </div>
      </Carousel>
        <button onClick={navigateToDemo} className="button">Begin Interview</button> {/* Navigation button */}

    </div>
  );
}

export default HeroSection;
