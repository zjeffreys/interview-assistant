import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HeroSection from './components/HeroSection';
import Demo from './components/Demo';
import Navbar from './components/Navbar'; // Make sure to import Navbar

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar outside of Routes but inside Router */}
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
