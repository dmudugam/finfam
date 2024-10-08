// src/pages/login/Login.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './login.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check login credentials
    if (email === 'dineth@gmail.com' && password === 'Dineth') {
      auth.login();
      navigate('/app'); // Redirect to app content after login
    } else {
      alert('Invalid email or password');
    }
  };

  const handleInput = () => {
    const earthIcon = document.getElementById('earth-icon');
    if (earthIcon) {
      earthIcon.classList.add('rotating');
    }
  };

  const handleBlur = () => {
    const earthIcon = document.getElementById('earth-icon');
    if (earthIcon) {
      earthIcon.classList.remove('rotating');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="earth-icon">
          <div id="earth-icon" className="svg-icon"></div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onInput={handleInput}
            onBlur={handleBlur}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onInput={handleInput}
            onBlur={handleBlur}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;