const mysql = require('mysql2');

// Database Connection Config
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql', // Using the password found in server.js
    database: 'shree-easyshop-main'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');

    // Query to select all users
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
        } else {
            if (results.length === 0) {
                console.log('No users found in the database.');
            } else {
                console.log(`Found ${results.length} user(s):`);
                console.table(results);
            }
        }
        connection.end();
    });
});
