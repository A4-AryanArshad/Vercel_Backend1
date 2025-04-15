import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/creation_nft.css';
import { ethers } from "ethers"; 
import Navbar from './Navbar';
import { Client, Storage, ID } from 'appwrite';
import Footer from './Footer';
import { Vortex } from 'react-loader-spinner';
import server from '../config';

const Create_NFT = ({state}) => {
  const [animateBox1, setAnimateBox1] = useState(false);
  const [animateBox2, setAnimateBox2] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const fileInputRef = useRef(null);

  const [nftDetails, setNftDetails] = useState({
    name: '',
    description: '',
    price: '',
    expirationDate: '',
    collection: '',
    category: '',
  });

  const client = new Client();
  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('674c38eb0018d1dfcb18');

  const storage = new Storage(client);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch(name) {
      case 'name':
        return value.trim().length < 3 ? 'Name must be at least 3 characters' : '';
      case 'description':
        return value.trim().length < 10 ? 'Description must be at least 10 characters' : '';
      case 'price':
        if(isNaN(value) || parseFloat(value) <= 0) return 'Price must be greater than 0';
        return '';
      case 'category':
        return !value ? 'Please select a category' : '';
      case 'image':
        return !value ? 'Please upload an image' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNftDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
    } else {
      setImagePreview(null);
      setImageFile(null);
      setErrors(prev => ({ ...prev, image: 'Please upload an image' }));
    }
  };

  const Mint = async () => {
    const { contract } = state;
    if (!contract) {
        console.error("Contract not initialized");
        return;
    }

    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed. Please install it to continue.");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const amount = { value: ethers.parseEther("0.00001") };
        const transaction = await contract.safeMint(userAddress, amount);
        await transaction.wait();
        
        const transaction2 = await contract.getMyCollection(userAddress);
        const mostRecentTransaction = transaction2[transaction2.length - 1];

        return mostRecentTransaction;
    } catch (error) {
        console.error("Minting failed:", error);
        return null;
    }
  };

  
  const handlesubmit = async (mostRecentTransaction) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create an NFT.');
        return;
      }
  
      const { name, description, price, category } = nftDetails;
  
      const bucketId = '674c3903000712765777';
      const response1 = await storage.createFile(bucketId, ID.unique(), imageFile);
      
      if (!response1?.$id) {
        throw new Error('File upload failed');
      }
  
      const filePath = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${response1.$id}/view?project=674c38eb0018d1dfcb18`;
  
      const nftData = {
        imgpath: filePath,
        nftname: name,
        description,
        price,
        category: category,
        mode: 'created',
        token_id: Number(mostRecentTransaction), 
      };
  
      const response = await fetch(`${server}/api/nft/addnft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          auth_token: token,
        },
        body: JSON.stringify(nftData),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        alert('NFT created successfully.');
        // Reset all form fields
        setNftDetails({
          name: '',
          description: '',
          price: '',
          expirationDate: '',
          collection: '',
          category: '',
        });
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(json.errors?.map(err => err.msg).join('\n') || json.error || 'Error creating NFT');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the NFT.');
    }
  };

  const handleCreateNFT = async (event) => {
    event.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', nftDetails.name),
      description: validateField('description', nftDetails.description),
      price: validateField('price', nftDetails.price),
      category: validateField('category', nftDetails.category),
      image: validateField('image', imageFile)
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setLoading(true);
    try {

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        alert("Please connect your MetaMask wallet first.");
        return null;
      }
      const mostRecentTransaction = await Mint();
      if (mostRecentTransaction) {
        await handlesubmit(mostRecentTransaction);
      } else {
        alert('Some Error NFT Data Not Store in DB.');
      }
    } catch (error) {
      console.error("Process failed:", error);
      alert('An error occurred during the NFT creation process.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedIn = !!localStorage.getItem('token');
      if (!isLoggedIn) navigate('/home');
    }, 1000);

    const timer1 = setTimeout(() => setAnimateBox1(true), 100);
    const timer2 = setTimeout(() => setAnimateBox2(true), 300);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);
  return (
    <>
  
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

      <div className={`main-content ${loading ? 'blurred' : ''}`}>
        <h1 style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'cursive', color: 'black', marginTop: '120px', marginLeft: '20px' }}>NFT Creation :</h1>
        <p style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'cursive', color: 'black', marginLeft: '20px' }}>
          Please fill in the details below to create your very own NFT.
          This includes important information such as the name, description, and price.
          Make sure to upload a high-quality image that represents your NFT well.
          Additionally, provide the necessary information, including royalties and expiration date.
        </p>

        <div className='contacts'>
          <div className={`box b1 ${animateBox1 ? 'animate slide-in-left' : ''}`}>
            <h1 style={{ fontFamily: 'cursive', color: 'white', fontSize: '30px', fontWeight: 'bold', textAlign: 'center' }}>Create NFT Here</h1>
            <br />
            <button className="btnn">ON Ethereum</button>
            <label>Upload Image*</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {errors.image && <div className="error-message">{errors.image}</div>}

            <br />
            <br />
            <label>Name*</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter NFT Name" 
              onChange={handleInputChange}
              value={nftDetails.name}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}

            <br />
            <br />
            <label>Description*</label>
            <input 
              type="textarea" 
              name="description" 
              placeholder="Enter Description" 
              onChange={handleInputChange}
              value={nftDetails.description}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}

            <br />
            <br />
            <label>Price (in Ethereum)*</label>
            <input 
              type="number" 
              name="price" 
              placeholder="Enter Price" 
              onChange={handleInputChange}
              value={nftDetails.price}
            />
            {errors.price && <div className="error-message">{errors.price}</div>}

            <br />
            <br />
            <label>Category*</label>
            <select 
              name="category" 
              onChange={handleInputChange}
              value={nftDetails.category}
            >
              <option value="">Select a category</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Photography">Photography</option>
              <option value="Pixel Art">Pixel Art</option>
              <option value="Meme">Memes</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}

            <br />
            <br />
            <button className='btn' onClick={handleCreateNFT}>Create NFT</button>
          </div>

          <div className={`box b2 ${animateBox2 ? 'animate slide-in-right' : ''}`}>
            <h1 style={{ fontFamily: 'cursive', color: 'black', fontSize: '35px', fontWeight: 'bold', textAlign: 'center' }}>Preview Your NFT</h1>
            <div className="preview-content">
              {imagePreview && (
                <img src={imagePreview} alt="NFT Preview" className="nft-preview" />
              )}
              <div className="nft-details">
                <br />
                <br />
                <br />
                <br />
                <br />
                <label>Name</label>
                <input type="text" value={nftDetails.name} disabled />
                <label>Description</label>
                <input type="textarea" value={nftDetails.description} disabled />
                <label>Price (in Ethereum)</label>
                <input type="text" value={nftDetails.price} disabled />
                <label>Category</label>
                <input type="text" value={nftDetails.category} disabled />
              </div>
            </div>
          </div>
        </div>
        <br /><br /><br /><br />
      </div>
      <Footer />
    </>
  );
};

export default Create_NFT;