import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HeroSection from './components/HeroSection';
import Demo from './components/Demo';

function App() {
  return (
    <Router>
      <div className="App">
  
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HeroSection />} exact />
          <Route path="/demo" element={<Demo />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
