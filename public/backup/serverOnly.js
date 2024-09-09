const express = require('express');
const app = express();
app.use(express.json());

let users = [
    { id: 1, name: 'Ravi Kumar' },
    { id: 2, name: 'Mahesh Babu' }
];

//Server statuss
app.get('/', (req, res) => {
    res.send("Server is Ready..");
});

// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST a new user
app.post('/users', (req, res) => {
    if(!req.body.name) {
        return res.status(400).send('Name is required');
    }
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT to update an existing user
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');

    user.name = req.body.name;
    res.json(user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');

    users.splice(userIndex, 1);
    res.send('User deleted');
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000, access server with http://localhost:3000');
});
