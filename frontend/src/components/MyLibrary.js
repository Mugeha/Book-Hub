import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyLibrary.css';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaHeart } from 'react-icons/fa'; // Import icons

const MyLibrary = () => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchLibrary = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must log in to access your library.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5001/api/books/library', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrary(res.data);
    } catch (error) {
      setError('Error fetching library. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5001/api/books/library/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrary((prevLibrary) => prevLibrary.filter((book) => book._id !== bookId));
      alert('Book removed from library.');
    } catch (error) {
      alert('Failed to remove book. Please try again.');
    }
  };

  const handleFavorite = async (bookId) => {
    try {
      await axios.post(
        'http://localhost:5002/api/favorites', // Assume a separate service
        { bookId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Book added to favorites!');
    } catch (error) {
      alert('Failed to add book to favorites. Please try again.');
    }
  };

  return (
    <div className="library-container">
      <h2>My Library</h2>
      <button onClick={() => navigate('/explore-books')} className="back-button">
        Back to Explore Books
      </button>
      {loading ? (
        <p>Loading library...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="books-list">
          {library.length > 0 ? (
            library.map((book) => (
              <div className="book-card" key={book._id}>
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p>{book.description}</p>
                <div className="card-actions">
                  <FaTrashAlt
                    className="icon remove-icon"
                    onClick={() => handleRemove(book._id)}
                    title="Remove from Library"
                  />
                  <FaHeart
                    className="icon favorite-icon"
                    onClick={() => handleFavorite(book._id)}
                    title="Add to Favorites"
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No books in your library yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
