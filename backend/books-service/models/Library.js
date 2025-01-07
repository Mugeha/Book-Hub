const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', // Reference the Book model
    },
  ],
});

const Library = mongoose.model('Library', LibrarySchema);

module.exports = Library;
