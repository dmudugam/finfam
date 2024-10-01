// src/components/Footer.tsx
import React from 'react';
import './footer.css'; // Import the CSS file for the footer

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      &copy; {new Date().getFullYear()} Dineth Mudugamuwa-Hewage. All rights reserved.
    </footer>
  );
};

export default Footer;