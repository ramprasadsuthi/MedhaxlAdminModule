require('dotenv').config(); // Add this to use .env variables
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Use Routes
app.use('/', authRoutes);
app.use('/students', studentRoutes);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port 3000, access server with http://localhost:3000');
});
