import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth'; // Import signOut
import './Navbar.css';



const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // No user is signed in
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(); // Use signOut from AWS Amplify
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <img src="/logo2.png" alt="Logo" />
      </Link>

      {/* Authentication Links */}
      <div className="auth-links">
        {user ? (
          <div className="user-info">
            {/* <p>Welcome, {user.username}</p> */}
            <button onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <div>
            {/* Link to /demo for sign-in */}
            <Link to="/demo">Sign In</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
