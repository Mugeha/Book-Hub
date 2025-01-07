const Book = require('../models/Book');
const axios = require('axios');
const Library = require('../models/Library');

// Fetch all books from the database
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
};

// Search books from database and Google Books API
const searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    // Search local database
    const dbBooks = await Book.find({ title: { $regex: query, $options: 'i' } });

    // Fetch results from Google Books API if local results are empty
    if (!dbBooks.length) {
      const googleBooks = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );

      const externalBooks = googleBooks.data.items.map((item) => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description available',
        bookId: item.id,
      }));

      return res.json(externalBooks);
    }

    res.json(dbBooks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search books', error: error.message });
  }
};

// Add a new book to the database
// Add a new book (adjusted to allow adding external books)
const addBook = async (req, res) => {
  const { title, author, genre, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and Author are required' });
  }

  try {
    const newBook = new Book({ title, author, genre, year });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add book', error: error.message });
  }
};


// Add book to My Library
// Add a book to the user's library
const addToLibrary = async (req, res) => {
  const { bookId, title, author, genre, year, description } = req.body;

  try {
    let book;

    if (bookId) {
      // Handle existing books
      book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
    } else if (title && author) {
      // Handle new books
      book = await Book.findOne({ title, author }); // Check if book already exists
      if (!book) {
        book = new Book({ title, author, genre, year, description });
        await book.save();
      }
    } else {
      return res.status(400).json({ message: 'Title and Author are required for new books' });
    }

    // Find or create the user's library
    let library = await Library.findOne({ userId: req.user.id });
    if (!library) {
      library = new Library({ userId: req.user.id, books: [] });
    }

    // Add the book to the user's library
    if (!library.books.includes(book._id)) {
      library.books.push(book._id);
      await library.save();
    }

    res.status(200).json({ message: 'Book added to library', library });
  } catch (error) {
    console.error('Error adding book to library:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get the user's library
const getLibrary = async (req, res) => {
  try {
    const library = await Library.findOne({ userId: req.user.id }).populate('books');
    if (!library) {
      return res.status(404).json({ message: 'Library not found' });
    }

    res.status(200).json(library.books); // Send the full list of books
  } catch (error) {
    console.error('Error fetching library:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getBooks, searchBooks, addBook, getLibrary, addToLibrary };
