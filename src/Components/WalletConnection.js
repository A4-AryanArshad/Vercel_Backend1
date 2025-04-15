import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/login.css'; // Ensure the path is correct
import server from '../config';
const WalletConnection = ({ onWalletConnect }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate MetaMask input fields
    if (!walletAddress || !walletName) {
      setError('Please fill in all MetaMask details');
      return;
    }

    // Simulate wallet connection success
    onWalletConnect(true); // Update the wallet connection status in App.js
    alert('MetaMask connected successfully!');
    navigate('/?action=register'); // Navigate back to the Registration form
  };

  return (
    <div className="wallet-connection-wrapper">
      <h1>MetaMask Wallet</h1> {/* Label MetaMask at the top */}
      <form onSubmit={handleSubmit}>
        <div className="metamask-form">
          <div className="input-box">
         
            <input
              type="text"
              id="walletAddress"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
           
            <input
              type="text"
              id="walletName"
              placeholder="Wallet Name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Connect Wallet</button>
      </form>
    </div>
  );
};

export default WalletConnection;
