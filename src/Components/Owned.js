import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Client, Storage } from 'appwrite';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../Components/created.css';
import Navbar from './Navbar';
import Footer from './Footer';
import server from '../config';
const Owned = () => {
  const [nfts, setNfts] = useState([]); // State to hold NFT data
  const [error, setError] = useState(null); // State to hold error message if any
  const client = new Client();
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation
  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('674c38eb0018d1dfcb18'); // Replace with your project ID
  const storage = new Storage(client);

  // Check if user is logged in and redirect if not
  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
      if (!isLoggedIn) {
        navigate('/home'); // Redirect to home page if user is not logged in
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(interval); // Cleanup on component unmount
    };
  }, [navigate]);

  // Fetch NFTs data from backend
  useEffect(() => {
    const fetchNFTs = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        console.error('No auth token found in localStorage');
        setError('Authentication token is missing. Please log in again.');
        return;
      }

      try {
        // Send request to fetch NFTs from backend
        const response = await axios.get(`${server}/api/nft/fetchallowned`, {
          headers: {
            auth_token: token
          },
        });

        console.log("API Response:", response.data); // Log the entire response to inspect the structure

        if (response.data) {
          // Process each NFT
          const updatedNFTs = await Promise.all(
            response.data.map(async (nft) => {
              console.log("NFT object:", nft); // Log the NFT object to inspect its properties
              console.log("path issss", nft.imgpath || "No image path available"); // Check if imgPath exists

              if (nft.imgpath) {
                try {
                  const fileNumber = nft.imgpath.split('/files/')[1].split('/view')[0];
                  console.log("That is file number ", fileNumber);
                  const coverFile = await storage.getFileView('674c3903000712765777', fileNumber);
                  console.log("resultant file:", coverFile);
                  return { ...nft, imgpath: coverFile.href };
                } catch (err) {
                  console.error('Error fetching NFT image:', err);
                  return { ...nft, imgpath: 'default-image.jpg' };
                }
              } else {
                return { ...nft, imgpath: 'default-image.jpg' }; // Fallback to default image if imgPath is not present
              }
            })
          );

          setNfts(updatedNFTs); // Update the state with the fetched NFTs
        } else {
          setError('No data received from the server.');
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to fetch NFTs. Please try again later.');
      }
    };

    fetchNFTs();
  }, [storage]);

  return (
    <>

   
    <div className="container my-5">
      {error && <div className="alert alert-danger">{error}</div>} {/* Show error if there's any */}
      {!error && nfts.length === 0 && <div className="text-center" style={{ fontFamily: 'initial', fontSize: "35px", color:'black', fontWeight: 'bold', fontStyle: 'revert' }}>No NFT Yet</div>} {/* Show message when no NFTs are available */}

      <div className="row g-4">
        {/* Loop through the NFTs and display each one */}
        {nfts.map((nft, index) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
            <div className="card nft-card">
              <img
                src={nft.imgpath || 'default-image.jpg'} // Show the image or fallback to default image
                className="card-img-top"
                alt={nft.title || 'NFT Image'} // Alt text for accessibility
              />
              <div className="card-body">
                <h5 className="card-title nft-title">{nft.nftname || 'Untitled NFT'}</h5>
                <br></br>
                <h6 className="card-subtitle">Price: ETH {nft.price || 'N/A'}</h6>
               
                <br></br>
        
                <Link
                  to='/editnft' // Use Link component for navigation
                  state={{ nft }} // Passing nft data as state
                  className="btn btn-primary mt-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <br>
</br>
<br>
</br>
<br>
</br>
      <Footer />
    </>
  );
};

export default Owned;
