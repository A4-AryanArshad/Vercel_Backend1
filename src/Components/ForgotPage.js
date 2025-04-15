import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner'; // Import loader spinner
import '../Components/forgot.css';



const ForgotPage = (props) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showVerifySection, setShowVerifySection] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/reverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setSuccessMessage('Code sent successfully to your email.');
        props.showalert('Reset code sent successfully', 'Success');
        setShowVerifySection(true); // Show Verify Code section
      } else {
        setErrorMessage(result.message || 'Failed to send code. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  const handleVerifyCode = async () => {
  if (!email || !code) {
    setErrorMessage('Email and code are required for verification.');
    return;
  }

  console.log(email)

  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const response = await fetch('http://localhost:5000/api/auth/Forgot_verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }), 
    });

    const result = await response.json();

    if (result.success) {
      setSuccessMessage('Code verified successfully.');
      props.showalert('Code verified successfully', 'Success');
      navigate(`/Reset_password?email=${email}`);





    } else {
      setErrorMessage(result.message || 'Verification failed. Please try again.');
    }
  } catch (error) {
    setErrorMessage('Server error. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`forgot-password-container ${loading ? 'blur' : ''}`}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="wrapper">
          <div className="form-box forgot">
            <form onSubmit={(e) => e.preventDefault()}>
              <h1 style={{color:"black"}}><b>Forgot Password</b></h1>
              <p style={{color:'black'}}>
                Enter your email address to receive a password reset code.
              </p>

              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
              {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

              <div className="input-box">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ color: 'black' }}
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                style={{ background: 'black' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>

              {showVerifySection && (
                <>
                  <div className="input-box" style={{ marginTop: '20px' }}>
                    <input
                      type="text"
                      placeholder="Enter the verification code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      style={{ color: 'black' }}
                    />
                    <i className="fa-solid fa-key"></i>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    style={{ background: 'black', marginTop: '10px' }}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </>
              )}
            </form>
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
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        </div>
      )}
    </div>
  );
};

export default ForgotPage;
