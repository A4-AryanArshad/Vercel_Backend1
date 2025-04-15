import React, { useEffect, useState } from 'react';
import { FaHandsHelping } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import server from '../config';

import { useLocation } from 'react-router-dom'; // Import useLocation to get state
import '../Components/admindetail.css';
import Navbar from './Navbar';
import Footer from './Footer';

const AdminDetail = () => {
  const location = useLocation();
  const { nft } = location.state || {}; 

  const [ownerName, setOwnerName] = useState(''); // State for owner's name

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!nft || !nft.imgpath) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to view NFT details.');
          return;
        }

        // Step 1: Get Owner ID
        const ownerResponse = await fetch(`${server}/api/nft/getownersold`, {
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

        // Step 2: Get Owner Name
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

        setOwnerName(nameData.name); // Update owner name state
      } catch (error) {
        console.error('Error fetching owner details:', error.message);
      }
    };

    fetchOwnerDetails();
  }, [nft]);


  if (!nft) {
    return <div>No NFT data available.</div>;
  }

  return (
    <>
      <div style={{ width: '100%' }}>
    
      </div>
      <div id="iy">
        {/* Left Box for Image */}
        <div id="loy">
          <img 
            src={nft.imgpath || 'default-image.jpg'} 
            alt={nft.nftname || 'NFT'} 
          />
        </div>

        {/* Right Box for NFT Details */}
        <div id="loy2">
          <h1>{nft.nftname || 'Untitled NFT'}</h1>
          <p>Owned by {ownerName || 'Unknown'}</p>

          <div id="carder">
            {/* Upper Info Section */}
            <div id="upperinfo">
              <CiClock1 id="lp" />
              <p>Sale ends {nft.Date || 'Date not available'}</p>
            </div>
            <hr />

            {/* Current Price and Buy Button */}
            <div id="innercarder">
              <p>Current price</p>
              <h3>{nft.price || 'N/A'} ETH</h3>
            </div>

            {/* Support Creator Section */}
            <div id="support">
              <div id="sec">
                <FaHandsHelping id="hand" />
                <h2>Supports creator $1</h2>
              </div>
              <p>This listing is paying the collection creator their suggested creator earnings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div id="description">
        <h2>Description</h2>
        <p>{nft.description || 'No description available.'}</p>
      </div>

      <Footer />
    </>
  );
};

export default AdminDetail;
