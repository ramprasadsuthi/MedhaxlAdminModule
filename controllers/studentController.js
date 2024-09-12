const db = require('../utils/db');

// Fetch Students with Pagination
exports.getStudents = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS total FROM enroll';
    const dataQuery = `SELECT * FROM enroll LIMIT ? OFFSET ?`;

    db.query(countQuery, (err, countResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        db.query(dataQuery, [limit, offset], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            res.json({
                students: results,
                totalRecords: totalRecords,
                totalPages: totalPages,
                currentPage: page
            });
        });
    });
};

// Register a New Student
exports.registerStudent = (req, res) => {
    const { name, email, phone, course, city, education } = req.body;
        const sql = `INSERT INTO enroll (name, email, phone, course, city, education) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [name, email, phone, course, city, education], (err, result) => {
            if (err) {
                console.error('Database error:', err); // Print the DB error to the console
                return res.status(500).send('Error registering the student. Please try again.\n' + err.message);
            }
            res.send('Student registered successfully!');
        });
};

exports.updateStudent = (req, res) => {
    const studentId = req.params.id;
        const updatedData = req.body;

        // Create arrays for dynamic query
        let fields = [];
        let values = [];

        // Add fields only if they exist in the request body
        if (updatedData.name) {
            fields.push('name = ?');
            values.push(updatedData.name);
        }
        if (updatedData.email) {
            fields.push('email = ?');
            values.push(updatedData.email);
        }
        if (updatedData.phone) {
            fields.push('phone = ?');
            values.push(updatedData.phone);
        }
        if (updatedData.course) {
            fields.push('course = ?');
            values.push(updatedData.course);
        }
        if (updatedData.city) {
            fields.push('city = ?');
            values.push(updatedData.city);
        }
        if (updatedData.education) {
            fields.push('education = ?');
            values.push(updatedData.education);
        }

        // If there are no fields to update, return a bad request
        if (fields.length === 0) {
            return res.status(400).send('No fields to update');
        }

        // Join the fields to create the query
        const query = `UPDATE enroll SET ${fields.join(', ')} WHERE id = ?`;

        // Add studentId to the values array
        values.push(studentId);

        // Execute the query
        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send('Error updating student: ' + err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Student not found');
            }

            res.status(200).send('Student updated successfully');
        });
};

