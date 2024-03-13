const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust according to your application's needs
    host: 'mysql-container', // Use the service name from docker-compose.yml as the host
    user: 'user',
    password: 'password',
    database: 'mydatabase'
});

// Utility function to attempt a database query with a retry mechanism
function queryWithRetry(sql, retries = 5) {
    return new Promise((resolve, reject) => {
        const attemptQuery = (attemptsLeft) => {
            pool.query(sql, (error, results) => {
                if (error) {
                    console.error(`Query error: ${error.message}. Retrying... Attempts left: ${attemptsLeft - 1}`);
                    if (attemptsLeft - 1 > 0) {
                        setTimeout(() => attemptQuery(attemptsLeft - 1), 2000); // Wait 2 seconds before retrying
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(results);
                }
            });
        };
        attemptQuery(retries);
    });
}

app.get('/', async (req, res) => {
    try {
        const results = await queryWithRetry('SELECT * FROM test_table', 5);
        res.json(results);
    } catch (error) {
        console.error('Failed to query the database:', error);
        res.status(500).send('Failed to access the database.');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
