const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000, access server with http://localhost:3000');
});

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'medhaxl'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log(`Connected to the database: ${db.config.database}`);
});

// Server status
app.get('/', (req, res) => {
    res.send("Server is Ready..");
});

// GET all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Database query failed');
        }
        res.json(results);
    });
});

// POST a new user
app.post('/users', (req, res) => {
    if(!req.body.name) {
        return res.status(400).send('Name is required');
    }
    const newUser = {
        name: req.body.name
    };
    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
            return res.status(500).send('Database insert failed');
        }
        newUser.id = result.insertId; // Get the inserted ID
        res.status(201).json(newUser);
    });
});

// PUT to update an existing user
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedName = req.body.name;

    if (!updatedName) {
        return res.status(400).send('Name is required');
    }

    db.query('UPDATE users SET name = ? WHERE id = ?', [updatedName, userId], (err, result) => {
        if (err) {
            return res.status(500).send('Database update failed');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.json({ id: userId, name: updatedName });
    });
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    let uid = userId;

    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).send('Database delete failed');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }
        res.send(`User ${userId} deleted`);
    });
});

