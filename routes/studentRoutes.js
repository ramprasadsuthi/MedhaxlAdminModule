const express = require('express');
const { getStudents, registerStudent } = require(`../controllers/studentController`);
const router = express.Router();
const studentController = require(`../controllers/studentController`);

// Student routes
router.get(`/`, getStudents);
router.post('/register', registerStudent);
// Define route for registering a student
//router.post(`/register`, studentController.registerStudent);
//router.put(`/students/:id`, studentController.updateStudent);
router.put('/:id', studentController.updateStudent);

module.exports = router;

