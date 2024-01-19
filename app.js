const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'your_database'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, phone } = req.body;

  // Insert the contact into the database
  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  const values = [name, email, phone];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting contact into MySQL:', err);
      res.status(500).send('Error saving contact to the database.');
      return;
    }
    console.log('Contact saved to MySQL:', result);
    res.send('Contact saved successfully!');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
