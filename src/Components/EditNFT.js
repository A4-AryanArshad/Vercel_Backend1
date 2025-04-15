import React, { useEffect, useState } from 'react';
import { FaHandsHelping } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { ethers } from "ethers"; 
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './editnft.css';
import { Vortex } from 'react-loader-spinner';
import server from '../config';

const EditNFT = ({state}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nft } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [newPrice, setNewPrice] = useState(nft?.price || '');
  const [newName, setNewName] = useState(nft?.nftname || '');
  const[prices,setprices]=useState(false);
  const[nftnamee,setnftnamee]=useState(false);
  const[tokene,settokene]=useState(false);
  const [newDescription, setNewDescription] = useState(nft?.description || '');
  const [showModal, setShowModal] = useState(null);
  const [error, setError] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setError('');
  };

  useEffect(() => {
    if (nft) {
      setprices(nft.price || '');
      setnftnamee(nft.nftname || '');
      settokene(nft.Token || '')
    }
  }, [nft]);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!nft || !nft.imgpath) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to view NFT details.');
          return;
        }

        const ownerResponse = await fetch(`${server}/api/nft/getowner`, {
          method: 'POST',
          headers: {
            'auth_token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imgpath: nft.imgpath }),
        });

        const ownerData = await ownerResponse.json();
        if (!ownerResponse.ok || !ownerData.ownerId) {
          throw new Error('Failed to fetch owner information.');
        }

        const nameResponse = await fetch(`${server}/api/auth/getownername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ownerId: ownerData.ownerId }),
        });

        const nameData = await nameResponse.json();
        if (!nameResponse.ok || !nameData.success) {
          throw new Error('Failed to fetch owner name.');
        }

        setOwnerName(nameData.name);
      } catch (error) {
        console.error('Error fetching owner details:', error.message);
      }
    };

    fetchOwnerDetails();
  }, [nft]);

  const Mint = async () => {
    
    const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length === 0) {
            alert("Please connect your MetaMask wallet first.");
            return null;
          }
    const { contract } = state;
    setLoading(true);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
  
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to continue.");
        return;
      }

      const token = localStorage.getItem('token');
      const checkResponse = await fetch(`${server}/api/nft/getnft`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imgpath: nft.imgpath }),
      });
  
      const checkData = await checkResponse.json();
      
      if (!checkResponse.ok) {
        alert(checkData.error || 'Failed to check NFT status');
        return;
      }
  
      if (checkData.nft.mode === 'list') {
        alert('This NFT is already listed!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
  
      if (!prices || isNaN(prices)) {
        console.error("Invalid price");
        alert("Please set a valid price first");
        return;
      }
  
      const wei = ethers.parseEther(prices.toString());
      console.log("Initiating listing transaction...");
      
      const transaction = await contract.listNFT(tokene, "100000000000000");
      await transaction.wait();
      
      const transaction2 = await contract.getAllListedNFTs();
      console.log("Listed", transaction2);
      
      handleListNFT();
  
    } catch (error) {
      console.error("Listing failed:", error);
      if (error.message.includes("already listed")) {
        alert("This NFT is already listed on the blockchain");
      } else {
        alert("Listing failed: " + error.message);
      } 
    }finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setNewPrice(value);
      setError('');
    } else {
      setError('Invalid price format. Use a positive number with up to two decimal places.');
    }
  };

  const handleSubmit = async (endpoint, data, successMessage, key) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to edit the NFT.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${server}/api/nft/${endpoint}`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        nft[key] = data[key];
        alert(successMessage);
        setShowModal(null);
      } else {
        alert(responseData.error || `Failed to update ${key}.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitName = () => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    handleSubmit('updatename', { imgpath: nft.imgpath, nftname: trimmedName }, 'Name updated successfully!', 'nftname');
  };

  const handleSubmitDescription = () => {
    const trimmedDesc = newDescription.trim();
    if (!trimmedDesc || trimmedDesc.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    handleSubmit('updatedescription', { imgpath: nft.imgpath, description: trimmedDesc }, 'Description updated successfully!', 'description');
  };

  const handleListNFT = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to list the NFT.');
      return;
    }
    setLoading(true);
  
    try {
      const response = await fetch(`${server}/api/nft/list`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imgpath: nft.imgpath }),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        alert('NFT listed successfully!');
        nft.mode = 'list';
        navigate('/dashboard');
      } else {
        alert(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while listing the NFT.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPrice = () => {
    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Price must be a number greater than 0.');
      return;
    }
    handleSubmit('updateprice', { imgpath: nft.imgpath, price: priceValue }, 'Price updated successfully!', 'price');
  };

  if (!nft) {
    return <div>No NFT data available.</div>;
  }

  return (
    <>
      
      <div className={`main-content ${loading ? 'blurred' : ''}`}>
        <div id="iy">
          <div id="loy">
            <img src={nft.imgpath || 'default-image.jpg'} alt={nft.nftname || 'NFT'} />
          </div>
          <div id="loy2">
            <h3 style={{ color: 'black' }}>
              <MdEdit onClick={() => setShowModal('name')} style={{ cursor: 'pointer', marginRight: '10px', color: 'black' }} />
              {nft.nftname || 'Untitled NFT'}
            </h3>
            <p>Owned by {ownerName || 'Unknown'}</p>
            <div id="carder">
              <hr />
              <div id="innercarder">
                <p>Current price</p>
                <h3>
                  <MdEdit onClick={() => setShowModal('price')} style={{ cursor: 'pointer', marginRight: '10px' }} />
                  {nft.price || 'N/A'} ETH
                </h3>
              </div>

              <div>
                <button
                  onClick={Mint}
                  disabled={loading}
                >
                  {loading ? 'Listing...' : 'List NFT'}
                </button>
              </div>

              <div id="support">
                <div id="sec">
                  <FaHandsHelping id="hand" />
                  <h2>Supports creator $1</h2>
                </div>
                <p>This listing pays the collection creator their suggested earnings.</p>
              </div>
            </div>
          </div>
        </div>
        <div id="description">
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>
            <MdEdit onClick={() => setShowModal('description')} style={{ cursor: 'pointer', marginRight: '10px', fontSize: '25px' }} />
            Description
            <br /><br />
            <span style={{ fontSize: '15px', fontFamily: 'cursive' }}>{nft.description || 'No description available.'}</span>
          </p>
        </div>
        <Footer />

        {showModal === 'name' && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Name</h2>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => handleInputChange(e, setNewName)}
                minLength={2}
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handleSubmitName} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        )}

        {showModal === 'description' && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Description</h2>
              <textarea 
                value={newDescription} 
                onChange={(e) => handleInputChange(e, setNewDescription)}
                minLength={10}
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handleSubmitDescription} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        )}

        {showModal === 'price' && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Price</h2>
              <input
                type="number"
                value={newPrice}
                onChange={handlePriceChange}
                min="0.01"
                step="0.01"
                placeholder="Enter new price"
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handleSubmitPrice} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowModal(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      {loading && (
        <div className="loader-overlay">
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperClass="vortex-wrapper"
            colors={['black', 'white', 'blue', 'yellow', 'iron', 'purple']}
          />
        </div>
      )}
    </>
  );
};

export default EditNFT;