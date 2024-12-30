const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Book', bookSchema);
