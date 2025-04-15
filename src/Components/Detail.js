import React, { useEffect, useState } from 'react';
import { FaHandsHelping } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Components/detail.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { ethers } from "ethers";
import { Client, Storage } from 'appwrite';
import { Vortex } from 'react-loader-spinner';
import server from '../config';


const Detail = ({state}) => {
  const location = useLocation();
  const { nft } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [nfts, setNfts] = useState([]); // State to hold NFT data
  const [error, setError] = useState(null); // State to hold error message if any
  const[prices,setprices]=useState(false);
  const[nftnamee,setnftnamee]=useState(false);
  const[tokene,settokene]=useState(false);
  const client = new Client();
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('674c38eb0018d1dfcb18'); // Replace with your project ID
  const storage = new Storage(client);
  const [ownerName, setOwnerName] = useState('');



   useEffect(() => {
      if (nft) {
        setprices(nft.price || '');  // Store current price
        setnftnamee(nft.nftname || '');  // Store current name
        settokene(nft.Token || '')
      }
  
     
    }, [nft]);
    
    console.log(" Aryan Saying Data ", prices , nftnamee ,tokene )


  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!nft || !nft.imgpath) return;
  
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to view NFT details.');
          return;
        }
  
        // Fetch owner details
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
  
        // Get owner name
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
  
        // Fetch NFTs for the owner
        const ownernftResponse = await fetch(`${server}/api/nft/getownernft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: ownerData.ownerId, imgpath: nft.imgpath }),
        });
        
        const ownernfts = await ownernftResponse.json();
        
        // Log the full response to understand its structure
        console.log("NFTs response:", ownernfts);  // Check the full response
        
        // If the response has a "data" property or another format
        if (ownernfts.data && Array.isArray(ownernfts.data) && ownernfts.data.length > 0) {
          const updatedNFTs = await Promise.all(
            ownernfts.data.map(async (nft) => {
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
          console.log("Updated NFTs: ", updatedNFTs);
          setNfts(updatedNFTs);
        } else {
          setError('No NFTs found or invalid response format.');
        }
        
        
      } catch (error) {
        console.error('Error fetching owner details:', error.message);
      }
    };
  
    fetchOwnerDetails();
  }, [nft]);  // Add [nft] to the dependency array to re-fetch if nft changes
  





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
        console.log(" Aryan Saying Data ", prices , nftnamee ,tokene )
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log("Connected wallet address:", userAddress);
        
        // Ensure prices is a valid number or string
        if (prices === undefined || prices === null || prices === "" || isNaN(prices)) {
            console.error("Invalid price: Price value is empty or not a number");
            alert("Price cannot be empty or invalid");
            return;
        }

     
        
 

        //        const amount = { value: ethers.parseEther(prices.toString()) };
        const transaction =await contract.buyNFT(tokene, { value:"100000000000000" });


        await transaction.wait();
        
        const transaction2 = await contract.getAllListedNFTs();
        
        console.log("Listed", transaction2);


        handleBuyNow();
        
    } catch (error) {
        console.error("Minting failed:", error);
        return null;
    }finally {
      setLoading(false);
    }
};





  console.log("all nftsss ",nfts)
  const handleBuyNow = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to buy an NFT.');
      setLoading(false);
      return;
    }

    try {
      const fetchOwnerResponse = await fetch(`${server}/api/nft/getowner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imgpath: nft.imgpath }),
      });

      const ownerData = await fetchOwnerResponse.json();
      if (!ownerData.ownerId) {
        throw new Error('Owner information not found.');
      }

      const updateOwnerResponse = await fetch(`${server}/api/nft/updateowner`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.ownerId,
          imgpath: nft.imgpath,
          mode: 'Sold',
          validity: 'Created',
        }),
      });

      const updateOwnerData = await updateOwnerResponse.json();
      if (!updateOwnerData.success) {
        throw new Error('Failed to update previous owner NFT status.');
      }

      const response = await fetch(`${server}/api/nft/buynft`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imgpath: nft.imgpath,
          nftname: nft.nftname,
          description: nft.description,
          price: nft.price,
         
          token:nft.Token,
          category:nft.Catagory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('NFT purchased successfully!');
        navigate('/dashboard');
      } else {
        alert('Error purchasing NFT: ' + (data.errors?.[0].msg || data.error));
      }
    } catch (error) {
      console.error('Error during the purchase:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add to cart.');
      setCartLoading(false);
      return;
    }

    try {
      const response = await fetch(`${server}/api/cart/cart`, {
        method: 'POST',
        headers: {
          'auth_token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imgpath: nft.imgpath,
          nftname: nft.nftname,
          description: nft.description,
          price: nft.price,
         
          token:nft.Token,
          category:nft.Catagory,
        
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('NFT added to cart!');
        navigate('/nft');
      } else {
        alert('Error adding NFT to cart: ' + (data.errors?.[0].msg || data.error));
      }
    } catch (error) {
      console.error('Error adding NFT to cart:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  if (!nft) {
    return <div>No NFT data available.</div>;
  }

  return (
    <>
  
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        </div>
      )}
      <div style={{ filter: loading ? 'blur(5px)' : 'none', transition: 'filter 0.3s ease' }}>
      <div id="iy">
        <div id="loy">
          <img src={nft.imgpath || 'default-image.jpg'} alt={nft.nftname || 'NFT'} />
        </div>
        <div id="loy2">
          <h1>{nft.nftname || 'Untitled NFT'}</h1>
          <p>Owned by {ownerName || 'Unknown'}</p>
          <div id="carder">
            <hr />
            <div id="innercarder">
              <p>Current price</p>
              <h3>{nft.price || 'N/A'} ETH</h3>
              <button onClick={Mint} disabled={loading}>
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              <button onClick={handleAddToCart} disabled={cartLoading}>
                {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
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
      <div id="description">
        <h2>Description</h2>
        <p>{nft.description || 'No description available.'}</p>
      </div>

      {/* Display NFTs */}

      <br></br>
      <br></br>
     
      <div className="container mt-4">

        <h1 style={{color:"black",fontFamily:"monospace",fontWeight:"bolder",fontStyle:"revert",textAlign:"center"}}> Recomndation Of This Owner </h1>
        <br></br>
        <br></br>
        <br></br>

        {nfts.length === 0 ? (
          <p>No NFTs available to display.</p>
        ) : (
          <div className="row g-4">
            {nfts.map((nft, index) => {
              const imagePath = nft.imgpath || 'default-image.jpg';
              const nftName = nft.nftname || 'Untitled NFT';
              return (
                <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                  <div className="card nft-card">
                    <img
                      src={imagePath}
                      className="card-img-top"
                      alt={nftName}
                      onError={(e) => {
                        e.target.src = 'default-image.jpg'; // Fallback if image fails
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title nft-title">{nftName}</h5>
                      <br></br>
                      <h6 className="card-subtitle">Price: ETH {nft.price || 'N/A'}</h6>
                      <br></br>
                      
                      <Link
                         to="/Detail"
                          state={{ nft }}
                          className="btn btn-primary mt-3"
                          >
                          View Details
                          </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
   <br></br>
   <br></br>
   <br></br>
   </div>
      <Footer />
    </>
  );
};

export default Detail;
