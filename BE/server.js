const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Sẽ tạo file này sau
const errorHandler = require('./middlewares/error'); // Sẽ tạo file này sau
const fileupload = require('express-fileupload');

// Load env vars
dotenv.config({ path: './config/config.env' }); // Sẽ tạo file này sau

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const homestays = require('./routes/homestays');
const bookings = require('./routes/bookings');
const reviews = require('./routes/reviews');
const categories = require('./routes/categories');
const favorites = require('./routes/favorites');
const adminAnalys = require('./routes/adminAnalys');

const app = express();

// Body parser
app.use(express.json());

app.use(express.static('public'));

// File upload
app.use(fileupload());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/categories', categories);
app.use('/api/v1/users', users);
app.use('/api/v1/homestays', homestays);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/favorites', favorites);
app.use('/api/v1/adminAnalys', adminAnalys);

app.get('/', (req, res) => {
  res.send('API is running...');
});
// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});