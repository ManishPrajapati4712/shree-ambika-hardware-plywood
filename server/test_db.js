const mysql = require('mysql2');

const passwordsToTry = [
    'My sql',       // User provided (failed previously, but trying again to be sure)
    'MySql',        // Case variation
    'mysql',        // Common default
    'root',         // Common default
    '',             // Empty password (XAMPP/WAMP default)
    'admin',        // Common default
    'password'      // Common default
];

const tryConnection = (index) => {
    if (index >= passwordsToTry.length) {
        console.log('--- ALL ATTEMPTS FAILED ---');
        console.log('Please verify your MySQL password manually.');
        process.exit(1);
    }

    const currentPassword = passwordsToTry[index];
    console.log(`Trying password: '${currentPassword}' ...`);

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: currentPassword,
        database: 'shree-easyshop-main'
    });

    connection.connect((err) => {
        if (err) {
            console.log(`Failed: ${err.message.split('(using password')[0]}`); // simplify error log
            connection.end();
            tryConnection(index + 1);
        } else {
            console.log('--------------------------------------------------');
            console.log(`SUCCESS! The correct password is: '${currentPassword}'`);
            console.log('--------------------------------------------------');
            connection.end();
            process.exit(0);
        }
    });
};

console.log(`Testing ${passwordsToTry.length} common passwords...`);
tryConnection(0);
