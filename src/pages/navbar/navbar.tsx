// src/NavBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import './navbar.css'; // Import the CSS file for styling

const NavBar: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/app');
  };

  const handleMakePayment = () => {
    navigate('/make-payment');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">FinFam</a>
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <ul className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
        <li><button onClick={handleHome} className="nav-button">Home</button></li>
        {auth.isAuthenticated ? (
          <>
            <li><button onClick={handleMakePayment} className="nav-button">Make a Payment</button></li>
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default NavBar;