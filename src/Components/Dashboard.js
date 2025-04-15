import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/dashboard.css';
import server from '../config';


import Owned from './Owned';
import Created from './Created';

import Sold from './Sold';
import Listed from './Listed';


import { Client, Storage, ID } from 'appwrite';

const Dashboard = () => {
  const client = new Client();
  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('674c38eb0018d1dfcb18'); // Replace with your project ID

  const storage = new Storage(client);
  const navigate = useNavigate();

  const [credential, setCredential] = useState({ namee: 'Name', emaile: 'Email' });
  const [coverImgLink, setCoverImgLink] = useState(null);
  const [profileImgLink, setProfileImgLink] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Created');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal visibility
  const [currentUrl, setCurrentUrl] = useState('');        // State to hold current URL
  const [editName, setEditName] = useState(credential.namee); // Default name is from credentials
const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal visibility
const [isBannerAnimated, setBannerAnimated] = useState(false);
const [isProfileAnimated, setProfileAnimated] = useState(false);


  const dropdownRef = useRef(null);

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditName(credential.namee); // Set current name in the input box
    setIsEditModalOpen(true); // Open the modal
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Close the modal
  };
  

  const handleOpenModal = () => {
    setCurrentUrl(window.location.href);  // Get the current URL of the page
    setIsModalOpen(true);  // Open the modal
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        alert('Failed to copy URL: ', err);
      });
  };

  useEffect(() => {
    // Trigger animations when the component mounts
    setTimeout(() => {
      setBannerAnimated(true);
      setProfileAnimated(true);
    }, 100);
  }, []);


  useEffect(() => {

    const interval = setInterval(() => {
      const isLoggedIn = !!localStorage.getItem('token'); // Example check, replace with your logic

      if (!isLoggedIn) {
        navigate('/home'); // Redirect to home page if user is not logged in
      }

    }, 1000); // Check every second (adjust as necessary)


    const savedCredential = JSON.parse(localStorage.getItem('user'));
    if (savedCredential) {
      setCredential({
        namee: savedCredential.name,
        emaile: savedCredential.email,
      });
    }

    return () => {
      clearInterval(interval);
    }
    
  }, []); 

  useEffect(() => {
    const fetchImagePaths = async () => {
      if (!credential.emaile) return;

      try {
        // Fetch cover image path
        const coverResponse = await fetch(`${server}/api/auth/getbanner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credential.emaile }),
        });
        const coverData = await coverResponse.json();
        console.log('Banner Image', coverData);

        if (coverData.path) {
          const fileNumber = coverData.path.split('/files/')[1].split('/view')[0];
          console.log('File Number:', fileNumber);

          const coverFile = await storage.getFileView('674c3903000712765777', fileNumber);
          console.log('Fetched Banner Image URL:', coverFile.href);
          setCoverImgLink(coverFile.href);
        }

        // Fetch profile image path
        const profileResponse = await fetch(`${server}/api/auth/getprofile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credential.emaile }),
        });
        const profileData = await profileResponse.json();
        console.log('Profile Image', profileData);

        if (profileData.path) {
          const fileNumber = profileData.path.split('/files/')[1].split('/view')[0];
          console.log('File Number:', fileNumber);

          const profileFile = await storage.getFileView('674c3903000712765777', fileNumber);
          console.log('Fetched Profile Image URL:', profileFile.href);
          setProfileImgLink(profileFile.href);
        }
      } catch (error) {
        console.error('Error fetching image paths:', error);
      }
    };

    fetchImagePaths();
  }, [credential.emaile]);

  const handleFileUpload = async (file, bucketId, setImageLink, updateBackendUrl) => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    try {
      setLoading(true);
      const response = await storage.createFile(bucketId, ID.unique(), file);
      const filePath = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${response.$id}/view?project=674c38eb0018d1dfcb18`;
      setImageLink(filePath);
      await updateBackendUrl(filePath);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload the image.');
    } finally {
      setLoading(false);
    }
  };

  const updateBackend = async (path, email, url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, path }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Image saved in Database');
      } else {
        console.log('Error: Image not saved');
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  };

  const handleCoverFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Update the file state
    await handleFileUpload(selectedFile, '674c3903000712765777', setCoverImgLink, (path) => updateBackend(path, credential.emaile, 'http://localhost:5000/api/auth/updatebanner'));
  };

  const handleProfileFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Update the file state
    await handleFileUpload(selectedFile, '674c3903000712765777', setProfileImgLink, (path) => updateBackend(path, credential.emaile, 'http://localhost:5000/api/auth/updateprofile'));
  };

  const handleOptionClick = (option, event) => {
    event.preventDefault();
    setSelectedOption(option);
    closeDropdown();
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
    } else {
      const savedCredential = JSON.parse(localStorage.getItem('user'));
      if (savedCredential) {
        setCredential({
          namee: savedCredential.name,
          emaile: savedCredential.email,
        });
      }
    }
  }, [navigate]);










  const handleUpdateName = async () => {
    try {
      // Send request to backend to update the name
      const response = await fetch(`${server}/api/auth/updateName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credential.emaile, name: editName }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update the name in the frontend state
        setCredential((prevState) => ({ ...prevState, namee: editName }));
        alert('Name updated successfully!');
        setIsEditModalOpen(false); // Close the modal
      } else {
        alert('Error updating name');
      }
    } catch (error) {
      console.error('Error during name update:', error);
      alert('Failed to update name');
    }
  };
  

  
  




  return (
    <div>
     
      {isEditModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Profile</h2>
      <label htmlFor="name-input">Name:</label>
      <input
        type="text"
        id="name-input"
        value={editName}
        onChange={(e) => setEditName(e.target.value)} // Update input value
      />
      <button onClick={handleUpdateName}>Edit</button>
      <button onClick={handleCloseEditModal}>Cancel</button>
    </div>
  </div>
)}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Current URL</h2>
            <p>{currentUrl}</p>
            <button onClick={handleCopyUrl}>Copy URL</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    <div className={`full-width-upload ${isBannerAnimated ? 'slide-in-left' : ''}`}>
  <label htmlFor="input-cover-file" id="drop-area" className="d-block text-center" style={{ position: 'relative' }}>
    <input
      type="file"
      accept="image/*"
      id="input-cover-file"
      className="form-control-file"
      onChange={handleCoverFileChange}
      hidden
    />
    {coverImgLink ? (
      <img
        src={coverImgLink}
        alt="Cover"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
      <div
        style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#000', // Optional background for better visibility
        }}
      >
        Please upload image
      </div>
    )}
  </label>
</div>


      <div className={`profile-pic ${isProfileAnimated ? 'slide-in-right' : ''}`}>
        <label htmlFor="input-profile-file" id="drop-area" className="d-block text-center">
          <input
            type="file"
            accept="image/*"
            id="input-profile-file"
            className="form-control-file"
            onChange={handleProfileFileChange}
            hidden
          />
          <div
            className="profile-view"
            style={{
              backgroundImage: profileImgLink ? `url(${profileImgLink})` : 'none',
              border: profileImgLink ? 'none' : '2px solid black',
              borderRadius: '50%',
            }}
          >
            {!profileImgLink && <img src={require('../profile1.png')} alt="Upload" />}
            {profileImgLink && (
              <img
                src={profileImgLink}
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            )}
          </div>
        </label>
      </div>

      {/* User Information */}
      <div className="namee" style={{ marginTop: '20px', paddingLeft: '30px' }}>
        <h1 style={{color:'black'}} >
          {credential.namee}{' '}
          <i className="fa-solid fa-certificate fa-1x"></i>{' '}
          <span style={{ fontSize: '25px', fontFamily: 'inherit', fontStyle: 'normal' }}>
            Get Verified
          </span>
        </h1>
      </div>
      <div className="editprofile">
        <ul className="unorder">
          <li style={{width:'100px',textAlign:'center'}}><Link onClick={handleOpenEditModal}>Edit Profile</Link></li>
          <li style={{width:'70px',textAlign:'center'}}><Link><i className="fa-solid fa-arrow-up-right-from-square" style={{justifyContent:'center'}} onClick={handleOpenModal}></i></Link></li>
        </ul>
      </div>
      <div className='option'>
        <ul className="list">
          <li style={{width:'100px',textAlign:'center'}}><Link to='/created' onClick={(e) => handleOptionClick('Created', e)}>Created</Link></li>
          <li style={{width:'100px',textAlign:'center'}}><Link to='/owned' onClick={(e) => handleOptionClick('Owned', e)}>Purchased</Link></li>
          <li style={{width:'100px',textAlign:'center'}}><Link to='/sold' onClick={(e) => handleOptionClick('Sold', e)}>Sold</Link></li>
          <li style={{width:'100px',textAlign:'center'}}><Link to='/list' onClick={(e) => handleOptionClick('Listed', e)}>Listed</Link></li>
        </ul>
      </div>

      <hr style={{ width: '100%', border: '1px solid #000', margin: '20px 0' }} />

      {/* Conditional Rendering Based on Selected Option */}
      {selectedOption === 'Owned' && <Owned />}
      {selectedOption === 'Created' && <Created />} 
      {selectedOption === 'Sold' && <Sold/>}
      {selectedOption === 'Listed' && <Listed/>}
     


    </div>
  );
};

export default Dashboard;
