import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner'; // Import loader spinner
import './Email.css'; // Create a CSS file for styles
import server from '../config';
const EmailVerify = (props) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the email from query params
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${server}/api/auth/email_first_verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: otp, email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        props.showalert('Email Verified Successfully', 'Success');
        navigate('/Login');
      } else {
        setErrorMessage(result.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMessage('');
    setTimer(30);
    setShowResend(false);

    try {
      const response = await fetch(`${server}/api/auth/reverify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        props.showalert('OTP resent successfully', 'Success');
      } else {
        setErrorMessage(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className={`email-verify-container ${loading ? 'blur' : ''}`}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="wrapper">
          <div className="form-box verify">
            <form onSubmit={(e) => e.preventDefault()}>
              <h1 style={{color:'black'}}><b>Email Verification</b></h1>
              <p style={{color:'black'}}>
                Your OTP has been sent to <strong style={{color:'black'}}>{email}</strong>. Enter it below to verify.
              </p>

              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleChange}
                  required
                  style={{ color: 'black' }}
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                style={{ background: 'black' }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {showResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{ background: 'black', marginTop: '10px' }}
                  disabled={loading}
                  
                >
                  Resend OTP
                </button>
              ) : (
                <p style={{color:'black', fontFamily:'inherit',fontSize:'15px',marginTop:'5px'}}>Resend OTP in {timer} seconds</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="loader">
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
    </div>
  );
};

export default EmailVerify;
