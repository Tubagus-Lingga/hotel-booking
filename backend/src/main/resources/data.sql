-- Clear existing data
DELETE FROM reservasi;
DELETE FROM customer;
DELETE FROM kamar;
DELETE FROM users;

-- Users (with email support)
INSERT INTO users (id, email, username, password, role) VALUES
(1, 'admin@hotel.com', 'admin', 'admin', 'ADMIN'),
(2, 'customer@test.com', 'customer', 'password123', 'PELANGGAN'),
(3, 'john@email.com', 'johndoe', 'pass123', 'PELANGGAN');

-- Customers (temporarily disabled - will fix column naming later)
-- INSERT INTO customer (customer_id, nama, alamat, telepon, email, user_id) VALUES
-- (1, 'John Doe', 'Jakarta Selatan', '08123456789', 'customer@test.com', 2),
-- (2, 'Jane Smith', 'Jakarta Pusat', '08198765432', 'john@email.com', 3);

-- Rooms (Kamar) with new structure
INSERT INTO kamar (id, nomor_kamar, tipe, harga, status_kamar, fasilitas_tambahan) VALUES
(1, '101', 'Standard', 300000, 'Available', 'Twin Bed, Hairdryer, Shower, Smart TV, Free Wifi'),
(2, '102', 'Standard', 300000, 'Available', 'Queen Bed, Hairdryer, Shower, Smart TV, Free Wifi'),
(3, '201', 'Executive', 750000, 'Available', 'King Bed, Hairdryer, Mini Bar, Sofa, Smart TV, Free Wifi, Bathtub'),
(4, '202', 'Executive', 750000, 'Available', 'King Bed, Hairdryer, Mini Bar, Sofa, Smart TV, Free Wifi, Bathtub');
