import React from 'react';
import { useParams } from 'react-router-dom';
import './BookDetails.css';

const BookDetails = ({ books }) => {
  const { id } = useParams();
  const book = books.find((b) => b._id === id);

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div className="book-details-container">
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.year}</p>
    </div>
  );
};

export default BookDetails;
