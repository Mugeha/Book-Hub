const Book = require('../models/Book');
const axios = require('axios');

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
const addBook = async (req, res) => {
  const { title, author, genre, year } = req.body;

  try {
    const newBook = new Book({ title, author, genre, year });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add book', error: error.message });
  }
};

// Add book to My Library
const addToLibrary = async (req, res) => {
  const { userId, book } = req.body;

  try {
    const userLibrary = await Library.findOneAndUpdate(
      { _id: userId },
      { $push: { library: book } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Book added to library', library: userLibrary.library });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book to library', error: error.message });
  }
};

module.exports = { getBooks, searchBooks, addBook, addToLibrary };
