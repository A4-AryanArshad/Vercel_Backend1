import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from './Icon';
import { Vortex } from 'react-loader-spinner';
import './navbar.css';
import { BrowserProvider, Contract } from "ethers";
import abi from "../MyToken.json";
import server from '../config';

const Navbar = ({ setContractState }) => {
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [credential, setCredential] = useState({ namee: 'Name', emaile: 'Email' });
  const [walletAddress, setWalletAddress] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleProtectedNavigation = (e) => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const getuser = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${server}/api/auth/getdata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          auth_token: token,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error fetching user data:', errorResponse.error);
        setLoading(false);
        return null;
      }

      const json = await response.json();
      if (json.user) {
        const userData = {
          namee: json.user.name || 'Name',
          emaile: json.user.email || 'Email',
        };
        setCredential(userData);
        localStorage.setItem('user', JSON.stringify({ name: json.user.name, email: json.user.email }));
        setLoading(false);
        return userData;
      }
    } catch (error) {
      console.error('Error during fetch operation:', error);
      setLoading(false);
      return null;
    }
  };

  const connectWallet = async (e) => {
    e.preventDefault();
    try {
      const isLoggedIn = !!localStorage.getItem('token');
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }
  
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
  
      const contractAddress = "0x65de6af0bef8c1449afc5b87c533a6fc233b66fd";
      const contractABI = abi.abi;
  
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts"
      }).catch((err) => {
        if (err.code === 4001) {
          alert("Please connect to MetaMask to continue!");
        } else {
          alert(`Connection error: ${err.message}`);
        }
      });
  
      if (!accounts || accounts.length === 0) {
        setWalletConnected(false);
        return;
      }
  
      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
  
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
        }
        window.location.reload();
      });
  
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
  
      setContractState({
        provider,
        signer,
        contract,
        account: accounts[0]
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
    } catch (error) {
      alert(`Connection failed: ${error.message || error.toString()}`);
      setWalletConnected(false);
    }
  };

  const handleViewProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const userData = await getuser();
    setLoading(false);
    if (userData) {
      navigate('/dashboard', { state: userData });
    }
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    setWalletConnected(false);
    setWalletAddress('');
    navigate('/login');
    setLoading(false);
  };

  useEffect(() => {
    getuser();
  }, [location]);

  const token = localStorage.getItem('token');

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          <span>NFT META MART</span>
        </NavLink>

        {loading && (
          <div className="loader-overlay">
            <Vortex
              visible={true}
              height="80"
              width="80"
              colors={['black', 'indigo', 'blue', 'red', 'iron', 'purple']}
            />
          </div>
        )}

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink exact to="/" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/aboutus" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/contact" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
              Contact Us
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact to="/chat" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
              Live Chat
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              exact 
              to="/create_nft" 
              activeClassName="active" 
              className="nav-links" 
              onClick={(e) => {
                handleClick();
                handleProtectedNavigation(e);
              }} 
              style={{ fontSize: '12px' }}
            >
              Create
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              exact 
              to="/nft" 
              activeClassName="active" 
              className="nav-links" 
              onClick={(e) => {
                handleClick();
                handleProtectedNavigation(e);
              }} 
              style={{ fontSize: '12px' }}
            >
              NFTs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              exact 
              to="/mall" 
              activeClassName="active" 
              className="nav-links" 
              target="_blank"
              onClick={(e) => {
                handleClick();
                handleProtectedNavigation(e);
              }} 
              style={{ fontSize: '12px' }}
            >
              Virtual Mall
            </NavLink>
          </li>
          <li className="nav-item">
            <a
              href="#connect"
              onClick={connectWallet}
              className="nav-links"
              style={{ color: walletConnected ? 'green' : 'white', fontSize: '12px' }}
            >
              {walletConnected ? `Connected: ${walletAddress.slice(0, 2)}..` : 'Connect Wallet'}
            </a>
          </li>
          {token ? (
            <>
              <li className="nav-item">
                <NavLink 
                  exact 
                  to="/dashboard" 
                  activeClassName="active" 
                  className="nav-links" 
                  onClick={handleViewProfile} 
                  style={{ fontSize: '12px' }}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/" className="nav-links" onClick={handleLogout} style={{ fontSize: '12px' }}>
                  Logout
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/cart" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
                  <i className="fa-solid fa-cart-shopping fa-2x" />
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink exact to="/login" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact to="/signup" activeClassName="active" className="nav-links" onClick={handleClick} style={{ fontSize: '12px' }}>
                  Signup
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-icon" onClick={handleClick}>
          {click ? <HamburgetMenuOpen /> : <HamburgetMenuClose />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;