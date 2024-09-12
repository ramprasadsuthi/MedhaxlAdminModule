const express = require('express');
const path = require('path'); // Import the 'path' module
const { login, sendResetLink } = require('../controllers/authController');
const router = express.Router();

// Route to serve the login.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login1.html'));  // Adjusted path
});

// Auth routes
router.post('/login', login);
router.post('/send-reset-link', sendResetLink);

module.exports = router;
