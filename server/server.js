const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mysql',
    database: process.env.DB_NAME || 'shree-easyshop-main',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 second timeout
});

// Non-blocking database initialization
// This won't block the API from starting
setTimeout(() => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err.message);
            console.log('API will still function with file-based storage for registration');
        } else {
            console.log('Connected to MySQL database');

            // Create Users Table if not exists
            const createTableQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(15) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

            connection.query(createTableQuery, (err, result) => {
                if (connection) connection.release();
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table checked/created');
                }
            });
        }
    });
}, 100); // Small delay to prevent blocking

// Register Endpoint (File-based storage)
app.post('/api/register', async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    try {
        const fs = require('fs');
        const path = require('path');
        // Use /tmp directory for Vercel serverless (writable directory)
        const usersFile = path.join('/tmp', 'users.json');

        // Read existing users
        let users = [];
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            users = JSON.parse(data);
        }

        // Check if phone already exists
        if (users.some(user => user.phone === phone)) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        // Add new user
        const newUser = {
            id: users.length + 1,
            name,
            phone,
            created_at: new Date().toISOString()
        };
        users.push(newUser);

        // Write back to file
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Get Users Endpoint (for Admin Panel)
app.get('/api/users', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        // Use /tmp directory for Vercel serverless
        const usersFile = path.join('/tmp', 'users.json');

        // Read users from file
        let users = [];
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            users = JSON.parse(data);
        }

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
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

// Get All Users (Admin)
app.get('/api/users', (req, res) => {
    const query = 'SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
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



// Create Orders Table if not exists
const createOrdersTableQuery = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;

db.query(createOrdersTableQuery, (err, result) => {
    if (err) console.error('Error creating orders table:', err);
    else {
        console.log('Orders table checked/created');
        // Migration: Add columns if they don't exist (Quick fix for dev)
        // Migration: Add columns if they don't exist
        const alterQuery1 = "ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) NOT NULL DEFAULT 'COD'";
        db.query(alterQuery1, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME') console.error('Error adding payment_method column:', err);
        });

        const alterQuery2 = "ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'Pending'";
        db.query(alterQuery2, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME') console.error('Error adding payment_status column:', err);
        });

        const alterQuery3 = "ALTER TABLE orders ADD COLUMN transaction_id VARCHAR(50) DEFAULT NULL";
        db.query(alterQuery3, (err) => {
            if (err && err.code !== 'ER_DUP_FIELDNAME') console.error('Error adding transaction_id column:', err);
        });
    }
});

// Create Order Endpoint
app.post('/api/create-order', (req, res) => {
    const { user_id, items, total_amount, shipping_address, city, payment_method, payment_status, transaction_id } = req.body;

    if (!user_id || !items || !total_amount || !shipping_address || !city || !payment_method) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // PAYMENT VERIFICATION LOGIC
    if (payment_method === 'UPI') {
        if (!transaction_id) {
            return res.status(400).json({ error: 'Transaction ID is required for UPI payments' });
        }

        // 1. Format Check
        if (transaction_id.length < 12) {
            return res.status(400).json({ error: 'Invalid Transaction ID format. Must be at least 12 digits.' });
        }
    }

    // 3. Duplicate Check (Database)
    // We only check for duplicate transaction_id if it's provided
    const checkDuplicateQuery = transaction_id ? 'SELECT id FROM orders WHERE transaction_id = ?' : null;

    if (checkDuplicateQuery) {
        db.query(checkDuplicateQuery, [transaction_id], (err, results) => {
            if (err) {
                console.error('Error checking duplicate transaction:', err);
                return res.status(500).json({ error: 'Database verification error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Payment Failed: This Transaction ID has already been used.' });
            }
            performStrictVerification();
        });
    } else {
        performStrictVerification();
    }

    function performStrictVerification() {
        if (payment_method === 'UPI') {
            // STRICT VERIFICATION STEP:
            // 1. Fetch Current Admin UPI from DB to verify receiver
            db.query("SELECT value FROM settings WHERE key_name = 'upi_id'", (err, results) => {
                if (err) return res.status(500).json({ error: 'System error: Cannot fetch Admin UPI for verification' });

                const adminUpi = results.length > 0 ? results[0].value : 'admin@upi';

                // SIMULATED BANK RESPONSE
                console.log(`[BANK_SIMULATION] Verifying Txn: ${transaction_id}`);
                console.log(`[BANK_SIMULATION] Expected Amount: ${total_amount}`);
                console.log(`[BANK_SIMULATION] Expected Receiver: ${adminUpi}`);

                // LOGIC CHECK:
                // Fail if ID starts with FAIL
                if (transaction_id.toUpperCase().startsWith('FAIL')) {
                    return res.status(400).json({ error: 'Payment Declined: Bank rejected the transaction.' });
                }

                // Proceed to save order
                saveOrder('Success');
            });
        } else {
            // COD
            saveOrder('Pending');
        }
    }

    function saveOrder(finalPaymentStatus) {
        const query = 'INSERT INTO orders (user_id, items, total_amount, shipping_address, city, payment_method, payment_status, transaction_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const itemsJson = JSON.stringify(items);
        const orderStatus = 'Pending';

        db.query(query, [user_id, itemsJson, total_amount, shipping_address, city, payment_method, finalPaymentStatus, transaction_id || null, orderStatus], (err, result) => {
            if (err) {
                console.error('Error creating order:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
        });
    }
});

// Get User Stats (Total Orders & Total Spent)
app.get('/api/user-stats/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
      SELECT 
        COUNT(*) as total_orders, 
        SUM(total_amount) as total_spent 
      FROM orders 
      WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0]);
    });
});

// Get Orders (Admin)
app.get('/api/orders', (req, res) => {
    const query = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Settings Table for UPI ID
const createSettingsTableQuery = `
  CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) NOT NULL UNIQUE,
    value VARCHAR(255) NOT NULL
  )
`;
db.query(createSettingsTableQuery, (err) => {
    if (err) console.error('Error creating settings table:', err);
    else {
        // Insert default UPI ID if not exists
        const insertDefaultUPI = "INSERT IGNORE INTO settings (key_name, value) VALUES ('upi_id', 'admin@upi')";
        db.query(insertDefaultUPI, (err) => {
            if (err) console.error('Error inserting default UPI:', err);
        });
    }
});

// Get UPI ID
app.get('/api/admin/upi', (req, res) => {
    db.query("SELECT value FROM settings WHERE key_name = 'upi_id'", (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) res.json({ upiId: results[0].value });
        else res.json({ upiId: '' });
    });
});

// Update UPI ID
app.post('/api/admin/upi', (req, res) => {
    const { upiId } = req.body;
    if (!upiId) return res.status(400).json({ error: 'UPI ID is required' });

    db.query("UPDATE settings SET value = ? WHERE key_name = 'upi_id'", [upiId], (err, result) => {
        if (err) {
            console.error('Error updating UPI ID:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'UPI ID updated successfully' });
    });
});

// Update Order Status (Admin)
app.post('/api/admin/order-status', (req, res) => {
    const { orderId, status, paymentStatus } = req.body;

    if (!orderId) return res.status(400).json({ error: 'Order ID is required' });

    let query = 'UPDATE orders SET ';
    const params = [];

    if (status) {
        query += 'status = ?, ';
        params.push(status);
    }
    if (paymentStatus) {
        query += 'payment_status = ?, ';
        params.push(paymentStatus);
    }

    // Remove trailing comma and space
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    params.push(orderId);

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Order status updated successfully' });
    });
});

// Admin Authentication

// Hardcoded Admin Credentials (for demonstration)
// In a real app, these should be in the database or environment variables
const ADMIN_PHONE = '9173187372';
const ADMIN_PASSWORD_HASH = '$2b$10$YourHashedPasswordHere'; // Placeholder, we'll verify plain text for now or hash it
const ADMIN_PLAIN_PASSWORD = '9998175675@Mehul';

// Store OTPs in memory (simple cache) - in production use Redis or DB with expiry
const adminOtps = {};

app.post('/api/admin/login', (req, res) => {
    const { phone, password } = req.body;

    if (phone === ADMIN_PHONE && password === ADMIN_PLAIN_PASSWORD) {
        // Direct Login Success
        console.log(`[ADMIN LOGIN] Successful for ${phone}`);
        res.json({ message: 'Login successful', isAdmin: true });
    } else {
        res.status(401).json({ error: 'Invalid Admin Credentials' });
    }
});

app.post('/api/admin/verify-otp', (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const storedOtp = adminOtps[phone];

    if (storedOtp && parseInt(otp) === storedOtp) {
        // Clear OTP after successful use
        delete adminOtps[phone];

        // Return success token or simply success message
        res.json({ message: 'Login successful', isAdmin: true });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
});

// Export app for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
