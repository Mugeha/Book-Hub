const express = require('express');
const {
  getBooks,
  searchBooks,
  addBook,
  addToLibrary,
  getLibrary
} = require('../controllers/bookController');
const { protect } = require('../Middleware/authenticate');

// const authenticateUser = require('../Middleware/authenticate'); // Import the middleware

const router = express.Router();

router.get('/', getBooks); // Fetch all books
router.get('/search', searchBooks); // Search for books
router.post('/', addBook); // Add a new book to the database
router.post('/add-to-library', protect, addToLibrary); // Add book to My Library
router.get('/library', protect , getLibrary); // Fetch the library

module.exports = router;
