import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vortex } from 'react-loader-spinner'; // Import loader spinner
import server from '../config';
const ResetPassword = (props) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
   // Extract the email from query params
   const queryParams = new URLSearchParams(location.search);
   const email = queryParams.get('email');


  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage('Both password fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${server}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password in the body
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Password reset successfully. Redirecting to login...');
        props.showalert('Password reset successfully', 'Success');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`reset-password-container ${loading ? 'blur' : ''}`}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="wrapper">
          <div className="form-box reset">
            <form onSubmit={(e) => e.preventDefault()}>
              <h1 style={{color:"black",fontFamily:'initial',fontStyle:"revert",fontWeight:'bold'}}><b>Reset Password</b></h1>
              <p style={{color:"black"}} >
                Enter your new password below to reset your password.
              </p>

              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
              {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

              <div className="input-box">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ color: 'black' }}
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <div className="input-box" style={{ marginTop: '10px' }}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ color: 'black' }}
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <button
                type="button"
                onClick={handleResetPassword}
                style={{ background: 'black', marginTop: '10px' }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
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

export default ResetPassword;
