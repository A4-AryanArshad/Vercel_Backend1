import React from 'react';
import './Footer.css'; // Custom styles
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="footer-container">

      <div className="foot">
        <div className="connect-icons">
          <h1 style={{paddingRight:'90px', fontFamily:'monospace',fontStyle:'revert',fontWeight:'bold',fontSize:'35px'}}>Connect with us</h1>
          <div className="icon" style={{paddingLeft:'20px'}}>
            <Link to="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube fa-2x"></i>
            </Link>
            <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </Link>
            <Link to="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </Link>
            <Link to="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </Link>
            <Link to="https://www.snapchat.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-snapchat fa-2x"></i>
            </Link>
            <Link to="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </Link>
          
          </div>
        </div>
      </div>

      <br></br>

      <footer className="footer-links">
        <Link to="/chat">FAQ</Link>
        <Link to="/Contact">Contact Us</Link>
        <Link to="#">Terms of Use</Link>
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Refund Policy</Link>
        <Link to="#">&copy; 2024 | NFT META MART </Link>
      </footer>

    </div>
  );
};

export default Footer;
