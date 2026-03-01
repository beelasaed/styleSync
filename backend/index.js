const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Health check route
app.get('/health', (req, res) => res.send('OK'));

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const clothesRoutes = require('./routes/clothesRoutes');
const accessoriesRoutes = require('./routes/accessoriesRoutes');
const outfitRoutes = require('./routes/outfitRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/accessories', accessoriesRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/laundry', laundryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/analytics', analyticsRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.Mongo_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('--- Backend Error ---');
  console.error('Path:', req.path);
  console.error('Body Keys:', Object.keys(req.body || {}));
  if (err.name === 'MulterError') {
    console.error('Multer Error Field:', err.field);
  }
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
