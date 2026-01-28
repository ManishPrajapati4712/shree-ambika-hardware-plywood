const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql',
    database: 'shree-easyshop-main'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to Db');
        return;
    }
    console.log('Connected!');

    // Disable foreign key checks to allow dropping tables in any order
    db.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) throw err;

        db.query('DROP TABLE IF EXISTS orders', (err) => {
            if (err) throw err;
            console.log('Orders table dropped');

            db.query('DROP TABLE IF EXISTS users', (err) => {
                if (err) throw err;
                console.log('Users table dropped');

                db.query('SET FOREIGN_KEY_CHECKS = 1', (err) => {
                    if (err) throw err;
                    console.log('Done');
                    process.exit();
                });
            });
        });
    });
});
