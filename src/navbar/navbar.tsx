// src/NavBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import './navbar.css'; // Import the CSS file for styling

const NavBar: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

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

  return (
    <nav className="navbar">
      <ul className="navbar-links">
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