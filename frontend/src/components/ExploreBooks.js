import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import './ExploreBooks.css';

const ExploreBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [internetBooks, setInternetBooks] = useState([]);
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/books'); // Fetch from Books Microservice
        setBooks(res.data);
      } catch (error) {
        setError('Error fetching books from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const searchOnlineBooks = async (query) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      setInternetBooks(res.data.items || []);
    } catch (error) {
      console.error('Error fetching books from the internet:', error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);

    // If the search query is non-empty, search the internet
    if (e.target.value.trim() !== '') {
      searchOnlineBooks(e.target.value);
    } else {
      setInternetBooks([]);
    }
  };

  const addToLibrary = async (book) => {
    // Check if the book is defined
    if (!book) {
      alert('Book data is missing. Please try again.');
      console.error('Book object is undefined or missing:', book);
      return;
    }
  
    // Ensure required fields are available or provide defaults
    const transformedBook = book._id
      ? { bookId: book._id } // Existing book with an `_id`
      : {
          title: book.title || book.volumeInfo?.title || 'Unknown Title',
          author: book.author || book.volumeInfo?.authors?.join(', ') || 'Unknown Author',
          genre: book.genre || 'General',
          year: parseInt(book.publishedDate || book.volumeInfo?.publishedDate?.slice(0, 4)) || new Date().getFullYear(), // Extract year
          description: book.description || book.volumeInfo?.description || 'No description available.',
        };
  
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated. Please log in.');
        return;
      }
  
      // API call to add the book to the library
      const response = await axios.post(
        'http://localhost:5001/api/books/add-to-library',
        transformedBook,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert('Book added to your library!');
      console.log('Book added successfully:', response.data);
    } catch (error) {
      // Handle API or network errors
      console.error('Error adding book to library:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to add book. Please try again.');
    }
  };
  
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="explore-books-container">
      <h2>Explore Books</h2>
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="books-list">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div className="book-card" key={book._id}>
                <h3>{book.title}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>{book.description}</p>
                <button onClick={() => addToLibrary(book)}>Add to Library</button>
              </div>
            ))
          ) : (
            <p>No books found matching your search in the database.</p>
          )}
          {internetBooks.length > 0 && (
            <>
              <h3>Books from the Internet</h3>
              {internetBooks.map((book) => (
                <div className="book-card" key={book.id}>
                  <h3>{book.volumeInfo.title}</h3>
                  <p>
                    <strong>Author:</strong> {book.volumeInfo.authors?.join(', ') || 'Unknown'}
                  </p>
                  <p>{book.volumeInfo.description || 'No description available.'}</p>
                  <button onClick={() => addToLibrary(book)}>Add to Library</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreBooks;
