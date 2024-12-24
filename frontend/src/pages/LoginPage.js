import React from "react";
import "../Styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="dialog-box">
        <img src="/company-logo.png" alt="Company Logo" className="logo" />
        <h2 className="retro-title">Login</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Sign up/Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
