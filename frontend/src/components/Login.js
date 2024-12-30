import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const Login = () => {
  // State to store form data
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // React Router's navigate function to redirect users after successful login
  const navigate = useNavigate();

  // Handle changes in form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields before submission
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in both fields'); // Show error toast
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Exit if validation fails

    try {
      // Send POST request to backend for user authentication
      const res = await axios.post('http://localhost:5000/api/users/login', formData);

      // Save the token in local storage for session management
      localStorage.setItem('token', res.data.token);

      // Show success toast and redirect user to the dashboard
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      // Display error toast with backend message or a generic message
      toast.error(error.response?.data.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login">
      <h2 style={{ paddingRight: '40px', textAlign: 'center' }}>LOG IN TO BOOKHUB</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* Input for email */}
        <div className="inputs">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{ margin: '10px 0', width: '100%' }}
            required
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
            style={{ margin: '10px 0', width: '100%' }}
            required
          />
        </div>

        <button
  type="submit"
  style={{
    padding: '10px 50px', // Maintain your padding
    marginTop: '10px', // Maintain your margin
    marginLeft: '0px', // Maintain your margin
    color: '#ffffff', // White text to match the dashboard
    backgroundColor: '#3b82f6', // Use the blue accent color from the dashboard
    border: 'none', // Remove any default borders
    borderRadius: '8px', // Rounded corners for consistency with the dashboard buttons
    fontWeight: '600', // Semi-bold font for better visibility
    fontSize: '16px', // Maintain a readable font size
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'all 0.3s ease', // Smooth transitions for hover effects
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add subtle shadow for a modern look
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = '#2563eb'; // Darker blue for hover effect
    e.target.style.transform = 'scale(1.05)'; // Slight scaling for a hover animation
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = '#3b82f6'; // Reset background color
    e.target.style.transform = 'scale(1)'; // Reset scaling
  }}
>
  LOGIN
</button>

      </form>

      {/* Link to Register Page */}
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
