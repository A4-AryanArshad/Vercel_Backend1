import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Client, Storage } from 'appwrite';
import { useNavigate, Link } from 'react-router-dom';
import '../Components/created.css';
import Navbar from './Navbar';
import Footer from './Footer';
import server from '../config';
const NFT = () => {
  const [nfts, setNfts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category
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
        const response = await axios.get(`${server}/api/nft/fetchall`, {
          headers: {
            auth_token: token,
          },
        });

        if (response.data) {
          const updatedNFTs = await Promise.all(
            response.data.map(async (nft) => {
              if (nft.imgpath) {
                try {
                  const fileNumber = nft.imgpath.split('/files/')[1].split('/view')[0];
                  const coverFile = await storage.getFileView('674c3903000712765777', fileNumber);
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

          console.log("NFTs are ", updatedNFTs);
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

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredNFTs = useMemo(() => {
    return nfts.filter((nft) => {
      const matchesSearch = nft.nftname.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || nft.Catagory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nfts, searchText, selectedCategory]);

  // Extract unique categories from NFTs
  const categories = useMemo(() => {
    const uniqueCategories = new Set(nfts.map((nft) => nft.Catagory));
    return ['All', ...uniqueCategories];
  }, [nfts]);

  return (
    <>
    
      <div className="container my-5">
      <lable>Search By Name</lable>
        <div className="search-container" style={{ display: 'flex', gap: '10px', marginBottom: '60px' }}>
      
          <input
            type="text"
            placeholder="Search NFTs by name..."
            value={searchText}
            onChange={handleSearchChange}
            className="form-control"
            style={{ fontSize: '16px', padding: '10px', border: '2px solid black', flex: '2' }}
          />
          
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-control"
            style={{ fontSize: '16px', padding: '10px', border: '2px solid black', flex: '1' }}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!error && filteredNFTs.length === 0 && (
          <div
            className="text-center"
            style={{
              fontFamily: 'initial',
              fontSize: '35px',
              color: 'black',
              fontWeight: 'bold',
              fontStyle: 'revert',
            }}
          >
            No NFTs found.
          </div>
        )}

        <div className="row g-4">
          {filteredNFTs.map((nft, index) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
              <div className="card nft-card">
                <img
                  src={nft.imgpath || 'default-image.jpg'}
                  className="card-img-top"
                  alt={nft.title || 'NFT Image'}
                />
                <div className="card-body">
                  <h5 className="card-title nft-title">{nft.nftname || 'Untitled NFT'}</h5>
                  <br />
                  <h6 className="card-subtitle">Price: ETH {nft.price || 'N/A'}</h6>
                  <br />
                
                  <Link
                    to="/detail"
                    state={{ nft }}
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

      <br />
      <br />
      <br />
      <br />

      <div className="boxe">
        <h1
          style={{
            textAlign: 'center',
            fontFamily: 'initial',
            fontSize: '50px',
            fontWeight: 'bolder',
            fontStyle: 'revert',
            paddingBottom: '4',
          }}
        >
          Trendings Explore
        </h1>
        <br />
        <br />
        {filteredNFTs.map((nft, index) => (
          <Link
            to="/detail"
            state={{ nft }}
            key={index}
            className="nft-link"
          >
            <div className="b">
              <img
                src={nft.imgpath || 'default-image.jpg'}
                className="card-img-top"
                alt={nft.title || 'NFT Image'}
              />
              <div className="text-row">
                <span><strong>{nft.nftname || 'Untitled NFT'}</strong></span>
                <span>Price: ETH {nft.price || 'N/A'}</span>
               
              </div>
            </div>
          </Link>
        ))}
      </div>

      <br />
      <br />
      <br />
      <br />
      {hasNFTs && <Footer />}
    </>
  );
};

export default NFT;