import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" required />
        <br />
        <label>Password:</label>
        <input type="password" required />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
