import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExploreBooks.css';

const ExploreBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/books'); // Fetch from Books Microservice
        setBooks(res.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="explore-books-container">
      <h2>Explore Books</h2>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
                <p><strong>Author:</strong> {book.author}</p>
                <p>{book.description}</p>
              </div>
            ))
          ) : (
            <p>No books found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreBooks;
