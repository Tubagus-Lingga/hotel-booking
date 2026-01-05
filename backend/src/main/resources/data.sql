-- Clear existing data
DELETE FROM invoice;
DELETE FROM payment;
DELETE FROM booking;
-- DELETE FROM reservasi;
DELETE FROM customer;
DELETE FROM kamar;
DELETE FROM users;


-- Users (with email support)
INSERT INTO users (id, email, username, password, role) VALUES
(1, 'admin@hotel.com', 'admin', 'admin', 'ADMIN');
