-- USER
INSERT INTO users (id, username, password, role) VALUES
(1, 'admin', 'admin', 'ADMIN'),
(2, 'resepsionis', 'resep', 'RESEPSIONIS'),
(3, 'pelanggan', 'user', 'PELANGGAN');

-- KAMAR
INSERT INTO kamar (nomor_kamar, tipe, harga, tersedia) VALUES
('101', 'Standard', 300000, true),
('102', 'Standard', 300000, false),
('201', 'Executive', 750000, true),
('301', 'Executive', 750000, true);

