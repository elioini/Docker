CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;



CREATE TABLE IF NOT EXISTS test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

-- Insert initial data
INSERT INTO test_table (message) VALUES ('Hello, world!');

CREATE DATABASE IF NOT EXISTS mydatabase;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mydatabase.* TO 'user'@'%';
FLUSH PRIVILEGES;