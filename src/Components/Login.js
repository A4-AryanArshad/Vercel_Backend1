import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../Components/login.css';
import Navbar from './Navbar';
import server from '../config';
import Footer from './Footer'
const Login = (props) => {
  const [credential, setCredential] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
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
      email: validateField('email', credential.email),
      password: validateField('password', credential.password),
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${server}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credential.email, password: credential.password }),
      });

      const json = await response.json();

      if (json.success && !json.verify) {
        alert('Please complete email verification first');
        navigate(`/Email_Verify?email=${credential.email}`);
      } else if (!json.success) {
        alert(json.error || 'Invalid credentials');
        navigate('/login');
      } else if (json.success && json.verify) {
        localStorage.setItem('token', json.token);
        props.showalert('Successfully Logged In', 'Success');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      props.showalert('Account Not Found', 'Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { name, email } = decoded;

    setLoading(true);
    try {
      const response = await fetch(`${server}/api/auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const json = await response.json();
      setLoading(false);

      if (json.success) {
        localStorage.setItem('token', json.token);
        props.showalert('Successfully Logged In', 'Success');
        navigate('/');
      } else {
        alert(json.error || 'User already exists');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      setLoading(false);
      alert('An error occurred during Google Sign-In. Please try again.');
    }
  };

  const hidePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
     
      <div className={`signup-container1 ${loading ? 'blur-background' : ''}`}>
        <div className="info-box1">
          <h1 style={{ color: 'black', fontFamily: 'inherit', fontWeight: 'bold', fontStyle: 'revert', fontSize: '50px' }}>Welcome Back</h1>
          <p>Log in to access an exclusive collection of NFTs, each offering something rare and unique. Discover a wide range of digital assets that you won’t find anywhere else. Whether you're a collector or just exploring, exciting new possibilities await!</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            New here?
            <Link to="/signup" className="getreg">
              Get Register
            </Link>
          </p>
        </div>

        <div className="wrapper1">
          <div className="form-box1 login">
            <form onSubmit={handleSubmit}>
              <h1 style={{ color: 'white' }}><b>Login</b></h1>
              
              {/* Email Input */}
              <div className="input-box1">
                <input
                  type="text"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={credential.email}
                  onChange={onChange}
                  style={{ borderColor: errors.email ? 'red' : '' }}
                />
                <i className="fa-solid fa-user"></i>
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}

              {/* Password Input */}
              <div className="input-box1">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  id="password"
                  name="password"
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

              <div className="remember-forgot">
                <label className="lable1" style={{ color: 'white' }}>
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/ForgotPage" style={{ color: 'white' }}>
                  Forgot password?
                </Link>
              </div>
              <br />
              <button type="submit" className="button1" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div className="register-link1">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ paddingLeft: '10px' }}>
                    Register
                  </Link>
                </p>
              </div>
            </form>

            {/* Google Sign-In Button */}
            <div className="google-signup" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => console.log('Google Sign-In Failed')}
                clientId={props.clientId}
              />
            </div>
          </div>
        </div>
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
      <br></br>
      <br></br>
      <br></br>

      <Footer></Footer>
    </>
  );
};

export default Login;