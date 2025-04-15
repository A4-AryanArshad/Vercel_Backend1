import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../Components/signup.css';
import Footer from './Footer';
import Navbar from './Navbar';
import server from '../config';
const Signup = (props) => {
  const [credential, setCredential] = useState({ name: '', email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = 'Name must contain only letters and spaces';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredential(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateField('name', credential.name),
      email: validateField('email', credential.email),
      password: validateField('password', credential.password),
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${server}/api/auth/createuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credential, isGoogleSignup: false }),
      });

      const json = await response.json();
      setLoading(false);

      if (json.success) {
        if (json.isverified) {
          localStorage.setItem('token', json.token);
          navigate('/Home');
        } else {
          navigate(`/Email_Verify?email=${credential.email}`);
        }
      } else {
        alert(json.error || 'User already exists');
        navigate('/Login');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setLoading(false);
      alert('An error occurred during signup. Please try again.');
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { name, email } = decoded;
    const password = Math.random().toString(36).slice(-8);

    setLoading(true);
    try {
      const response = await fetch(`${server}/api/auth/createuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, isGoogleSignup: true }),
      });

      const json = await response.json();
      setLoading(false);

      if (json.success) {
        localStorage.setItem('token', json.token);
        navigate('/Home');
      } else {
        alert(json.error || 'User already exists');
        navigate('/Login');
      }
    } catch (error) {
      console.error('Error during Google Signup:', error);
      setLoading(false);
      alert('An error occurred during Google Signup. Please try again.');
    }
  };

  const hidePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>

      <div className={`main-content ${loading ? 'blur-background' : ''}`}>
        <div className="signup-container">
          <div className="info-box">
            <h1>Explore NFTs</h1>
            <p>Discover rare digital collectibles with NFTs on our platform! Own exclusive artworks each a unique asset just for you. Start your journey today and unlock the beauty and value of NFTs!</p>
            <p style={{ fontSize: '24px', fontFamily: 'revert', fontStyle: 'initial', fontWeight: 'bold' }}>We are Providing the services:</p>
            <div className="button-group">
              <button>Create NFT</button>
              <button>Sale NFT</button>
              <button>Purchase NFT</button>
              <button>Virtual Mall</button>
              <button>Gaming Experience</button>
            </div>
          </div>
          <div className="wrapper">
            <div className="form-box register">
              <form onSubmit={handleSubmit}>
                <h1 style={{ color: 'black' }}><b>Registration</b></h1>
                
                {/* Name Input */}
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    name="name" 
                    id="name" 
                    value={credential.name} 
                    onChange={onChange} 
                    style={{ borderColor: errors.name ? 'red' : '' }}
                  />
                  <i className="fa-solid fa-user"></i>
                </div>
                {errors.name && <div className="error-message">{errors.name}</div>}

                {/* Email Input */}
                <div className="input-box">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    name="email" 
                    id="email" 
                    value={credential.email} 
                    onChange={onChange} 
                    style={{ borderColor: errors.email ? 'red' : '' }}
                  />
                  <i className="fa-solid fa-envelope"></i>
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}

                {/* Password Input */}
                <div className="input-box">
                  <input 
                    type={passwordVisible ? 'text' : 'password'} 
                    placeholder="Password" 
                    name="password" 
                    id="password" 
                    value={credential.password} 
                    onChange={onChange} 
                    style={{ borderColor: errors.password ? 'red' : '' }}
                  />
                  <i 
                    className={`fa-solid ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`} 
                    onClick={hidePassword} 
                    style={{ cursor: 'pointer' }}
                  ></i>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}

                <button className="sub" type="submit">Register</button>
                <div className="register-link">
                  <p style={{ color: 'black',fontSize:'13px' }}>Already have an account? <Link to="/login">Login</Link></p>
                </div>
              </form>
              <div className="google-signup">
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => console.log('Google Signup Failed')}
                  clientId={props.clientId}
                />
              </div>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'cursive', marginTop: '50px', marginLeft: '20px',color:'black' }}>
          What we Provide :
        </h1>
        <p style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'cursive', marginLeft: '20px' }}>
          As a leading NFT platform on Ethereum, we offer a secure and transparent marketplace. Discover unique digital assets, connect with creators, and build a valuable collection. Our platform ensures the authenticity and provenance of every NFT.
        </p>
        
        <div className="contain">
          <div className="box b1 animate animate-left">
            <img
              src={require('../mission.jpg')}
              alt="Mission"
              style={{ height: '120px', width: '120px', borderRadius: '50%' }}
            />
            <h3>Our Mission</h3>
            <p>To inspire creativity and innovation through Technology and art and also discover a new virtual mall gaming Experience for user.</p>
          </div>

          <div className="box b2 animate animate-right">
            <img
              src={require('../vision.jpg')}
              alt="Vision"
              style={{ height: '120px', width: '120px', borderRadius: '50%' }}
            />
            <h3>Our Vision</h3>
            <p>To be the leader in Digital art solutions, fostering a global community of creators and also for user to Experience a new shopping platform.</p>
          </div>

          <div className="box b3 animate animate-left">
            <img
              src={require('../value.jpg')}
              alt="Values"
              style={{ height: '120px', width: '120px', borderRadius: '50%' }}
            />
            <h3>Our Values</h3>
            <p>Creativity, Collaboration, and Community are at the heart of everything we do.</p>
          </div>
        </div>
<br>
</br>
<br>
</br>
        <Footer />
      </div>
      
      {loading && (
        <div className="loader">
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        </div>
      )}
    </>
  );
};

export default Signup;