import React, { useState } from 'react';
import '../Styles/CreateAccountPage.css';

const CreateAccountPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    // Simulate OTP generation
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    alert(`Your OTP is: ${generatedOtp}`); // Replace with email-sending logic
    setOtpSent(true);
    setOtp(generatedOtp);
  };

  const handleVerifyOtp = (enteredOtp) => {
    if (parseInt(enteredOtp) === otp) {
      alert('OTP Verified Successfully!');
      // Redirect to Profile Page
      window.location.href = '/profile';
    } else {
      alert('Invalid OTP!');
    }
  };

  return (
    <div className="create-account-container">
      <div className="dialog-box">
        <h2 className="retro-title">Create New Account</h2>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Bio" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          {otpSent ? (
            <div>
              <input type="text" placeholder="Enter OTP" onBlur={(e) => handleVerifyOtp(e.target.value)} />
            </div>
          ) : (
            <button type="button" onClick={handleSendOtp}>Send OTP</button>
          )}
          <button type="submit">Create Account</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountPage;
