const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
// Middleware
app.use(express.json());
app.use(require('cors')());

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB and start server
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
//   .catch((err) => console.error('Database connection failed', err));
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});