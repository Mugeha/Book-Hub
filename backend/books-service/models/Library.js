const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  library: [
    {
      bookId: String,
      title: String,
      author: String,
      description: String,
    },
  ],
});

module.exports = mongoose.model('Library', librarySchema);
