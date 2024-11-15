import React from 'react';
import "./style.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      {/* Add any additional footer items here */}
    </footer>
  );
};

export default Footer;
