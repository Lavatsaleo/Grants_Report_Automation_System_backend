// Import express
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize the app
const app = express();

// Define a port for the server
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password', // Replace with your root password
  database: 'grants' // The name of the database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Create a basic route to test the database connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      res.status(500).send('Error querying the database');
    } else {
      res.send(`Database query result: ${results[0].result}`);
    }
  });
});

// Grants Management and Report Deadlines Management Endpoints
// (Existing endpoints are already here)

// Endpoint to add a report submission
app.post('/submissions', (req, res) => {
  const { report_id, submitted_by, sharepoint_link } = req.body;
  const submission_date = new Date();

  // Insert the new report submission into the database
  db.query(
    'INSERT INTO Submissions (report_id, submitted_by, submission_date, sharepoint_link) VALUES (?, ?, ?, ?)',
    [report_id, submitted_by, submission_date, sharepoint_link],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error inserting report submission');
      }

      res.status(201).send('Report submission added successfully');
    }
  );
});

// Endpoint to get all report submissions
app.get('/submissions', (req, res) => {
  db.query('SELECT * FROM Submissions', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching report submissions');
    }

    res.json(results);
  });
});

// Endpoint to update a report submission
app.put('/submissions/:id', (req, res) => {
  const { id } = req.params;
  const { sharepoint_link } = req.body;
  const updated_submission_date = new Date();

  // Update the report submission in the database
  db.query(
    'UPDATE Submissions SET sharepoint_link = ?, submission_date = ? WHERE submission_id = ?',
    [sharepoint_link, updated_submission_date, id],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error updating report submission');
      }

      res.send('Report submission updated successfully');
    }
  );
});

// Endpoint to delete a report submission
app.delete('/submissions/:id', (req, res) => {
  const { id } = req.params;

  // Delete the report submission from the database
  db.query('DELETE FROM Submissions WHERE submission_id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting report submission');
    }

    res.send('Report submission deleted successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
