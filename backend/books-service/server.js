const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/booksRoutes');

dotenv.config(); // Load environment variables
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected for Book-Service"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Middleware
app.use(express.json());
app.use(require('cors')());

// Routes
app.use('/api/books', bookRoutes);


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Book-Service is running on port ${PORT}`);
});
