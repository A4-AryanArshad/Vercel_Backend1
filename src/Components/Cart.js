import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Client, Storage } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Components/cart.css';
import Navbar from './Navbar';
import Footer from './Footer';
import server from '../config';

const Cart = () => {
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);
  const [hasNFTs, setHasNFTs] = useState(false);
  const client = new Client();
  const navigate = useNavigate();

  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('674c38eb0018d1dfcb18');

  const storage = new Storage(client);

  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedIn = !!localStorage.getItem('token');
      if (!isLoggedIn) {
        navigate('/home');
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchNFTs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found in localStorage');
        setError('Authentication token is missing. Please log in again.');
        return;
      }

      try {
        const response = await axios.get(`${server}/api/cart/fetchall`, {
          headers: {
            auth_token: token
          },
        });

        console.log("API Response:", response.data);

        if (response.data) {
          const updatedNFTs = await Promise.all(
            response.data.map(async (nft) => {
              console.log("NFT object:", nft);
              console.log("path issss", nft.imgpath || "No image path available");

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
                return { ...nft, imgpath: 'default-image.jpg' };
              }
            })
          );

          setNfts(updatedNFTs);
          setHasNFTs(updatedNFTs.length > 0);
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
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && nfts.length === 0 && (
          <div className="empty-cart-container">
            <h1>Your Cart is Empty !</h1>
            <p>Looks like you haven’t added anything yet. Start shopping now!</p>
            <Link className="continue-shopping-button" to="/nft">Continue Shopping</Link>
          </div>
        )}

        <div className="row g-4">
          {nfts.map((nft, index) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
              <div className="card nft-card">
                <img
                  src={nft.imgpath || 'default-image.jpg'}
                  className="card-img-top"
                  alt={nft.nftname || 'NFT Image'}
                />
                <div className="card-body">
                  <h5 className="card-title nft-title">{nft.nftname || 'Untitled NFT'}</h5>
                  <br />
                  <h6 className="card-subtitle">Price: ETH {nft.price || 'N/A'}</h6>
                  <br />
                  
                  <Link
                    to='/cartdetail'
                    state={{ nft }}
                    className="btn btn-primary mt-3"
                  >
                    View Details
                  </Link>

                  {/* Remove from Cart Button */}
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <br /><br /><br /><br />
      {hasNFTs && <Footer />}
    </>
  );
};

export default Cart;
