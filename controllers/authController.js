const db = require('../utils/db');

// Function to handle login
exports.login = (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const [authType, authValue] = authHeader.split(' ');
    if (authType !== 'Basic' || !authValue) {
        return res.status(401).json({ error: 'Invalid Authorization format' });
    }

    const [username, password] = Buffer.from(authValue, 'base64').toString('utf8').split(':');
    const sql = 'SELECT * FROM login WHERE username = ? AND password = ?';
    
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ message: `Welcome, ${username}!` });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
};

// Send Reset Link (example placeholder)
exports.sendResetLink = (req, res) => {
    const { email } = req.body;
    
    // Query to check if the email exists in the login table
    const query = 'SELECT * FROM login WHERE email = ?';

        db.query(query, [email], (err, result) => {
            if (err) {
                return res.status(500).send('Server error');
            }

            if (result.length === 0) {
                // If the email does not exist in the login table
                return res.status(404).send('This email address is not registered in our system.');
            }

            // If email exists, send a reset link (implement email sending logic here)
            // For example, use Nodemailer to send a reset email
            sendPasswordResetEmail(email); // Replace with your email sending logic

            res.send('Password reset link has been sent to your email.');
        });
};

function sendPasswordResetEmail(email) {
    console.log(`Sending password reset email to ${email}`);
    // Add your email logic here using Nodemailer or other service
}
