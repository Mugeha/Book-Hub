const express = require('express');
const {
  getBooks,
  searchBooks,
  addBook,
  addToLibrary,
} = require('../controllers/bookController');

const router = express.Router();

router.get('/', getBooks); // Fetch all books
router.get('/search', searchBooks); // Search for books
router.post('/', addBook); // Add a new book to the database
router.post('/add-to-library', addToLibrary); // Add book to My Library

module.exports = router;
