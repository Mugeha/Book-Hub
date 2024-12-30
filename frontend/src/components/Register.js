import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './register.css';

const Register = () => {
  // State to store form data
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields before submission
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Exit if validation fails

    try {
      // Send POST request to backend
      const res = await axios.post('http://localhost:5000/api/users/register', formData);

      // Display success message on successful registration
      toast.success(`Registration successful! Welcome, ${res.data.name}`);
    } catch (error) {
      // Display error message from backend or a generic error message
      toast.error(error.response?.data.message || 'An error occurred');
    }
  };

  return (
    <div className='register'>
      {/* ToastContainer for rendering toast notifications */}
      <ToastContainer />

      <h2 style={{ paddingRight: '40px', textAlign: 'center' }}>REGISTER</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* Input for name */}
        <div className="inputs">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{ margin: '10px 0', padding: '15px 45px', width: '100%' }}
          />
        </div>

        {/* Input for email */}
        <div className="inputs">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ margin: '10px 0', padding: '15px 45px', width: '100%' }}
          />
        </div>

        {/* Input for password */}
        <div className="inputs">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ margin: '10px 0', padding: '15px 45px', width: '100%' }}
          />
        </div>

        {/* Submit button */}
        <button
  type="submit"
  style={{
    padding: '10px 50px', // Maintain your padding
    marginTop: '10px', // Maintain your margin
    marginLeft: '0px', // Maintain your margin
    color: '#ffffff', // White text to match your design
    backgroundColor: '#3b82f6', // Use the same blue accent from the dashboard
    border: 'none', // Remove default borders
    borderRadius: '8px', // Rounded corners for consistency
    fontWeight: '600', // Semi-bold for good visibility
    fontSize: '16px', // Maintain readable font size
    cursor: 'pointer', // Pointer cursor for interactivity
    transition: 'all 0.3s ease', // Smooth transitions for hover effects
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = '#2563eb'; // Darker blue for hover
    e.target.style.transform = 'scale(1.05)'; // Slight scaling for hover animation
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = '#3b82f6'; // Reset to original blue
    e.target.style.transform = 'scale(1)'; // Reset scaling
  }}
>
  Register
</button>

      </form>

      {/* Link to Login Page */}
      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
