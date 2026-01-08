const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mysql',
    database: 'shree-easyshop-main',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist. Please create database "shree-easyshop-main"');
        } else {
            console.error('Error connecting to database:', err);
        }
    } else {
        console.log('Connected to MySQL database');

        // Create Users Table if not exists
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        connection.query(createTableQuery, (err, result) => {
            connection.release();
            if (err) throw err;
            console.log('Users table checked/created');
        });
    }
});

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';

        db.query(query, [name, email, phone, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Phone number already registered' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: 'Phone and password are required' });
    }

    const query = 'SELECT * FROM users WHERE phone = ?';

    db.query(query, [phone], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid phone or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid phone or password' });
        }

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
    });
});

// Forgot Password - Send OTP (Simulated)
app.post('/api/forgot-password', (req, res) => {
    const { phone, email } = req.body;

    if (!phone && !email) {
        return res.status(400).json({ error: 'Phone or Email is required' });
    }

    const query = phone
        ? 'SELECT * FROM users WHERE phone = ?'
        : 'SELECT * FROM users WHERE email = ?';

    const param = phone || email;

    db.query(query, [param], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // SIMULATED OTP
        const otp = Math.floor(1000 + Math.random() * 9000); // 4 digit OTP
        console.log(`[SIMULATION] OTP for ${param} is: ${otp}`);

        res.json({ message: 'OTP sent successfully', otp: otp }); // returning OTP for testing convenience
    });
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
    const { phone, email, newPassword } = req.body;

    if ((!phone && !email) || !newPassword) {
        return res.status(400).json({ error: 'Phone/Email and new password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = phone
            ? 'UPDATE users SET password = ? WHERE phone = ?'
            : 'UPDATE users SET password = ? WHERE email = ?';

        const param = phone || email;

        db.query(query, [hashedPassword, param], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Password reset successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
