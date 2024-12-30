import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <nav className="dashboard-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/books">Books</a></li>
            <li><a href="/favorites">Favorites</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="dashboard-main">
        {user ? (
          <div className="welcome-section">
            <h3>Welcome, {user.name}!</h3>
            <p>What would you like to do today?</p>
            <div className="dashboard-actions">
              <button onClick={() => navigate('/books')}>Explore Books</button>
              <button onClick={() => navigate('/add-book')}>Add a Book</button>
              <button onClick={() => navigate('/favorites')}>View Favorites</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      
      <footer className="dashboard-footer">
        <p>© 2024 Bookhub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
