import React from 'react';
import './Footer.css'; // Make sure to create a corresponding CSS file

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} AI Alchemists LLC. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
