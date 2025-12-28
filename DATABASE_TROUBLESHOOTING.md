# TROUBLESHOOTING: Database Tables Tidak Terbuat

## Problem
Setelah clone dan setup, tabel database tidak otomatis terbuat.

## Root Cause
Hibernate hanya create tables saat aplikasi Spring Boot **pertama kali dijalankan**.

## Solution

### Step 1: Pastikan Database Sudah Dibuat
```sql
CREATE DATABASE hotel_booking;
USE hotel_booking;
SHOW TABLES;  -- Harusnya kosong atau ada tables
```

### Step 2: Cek application.properties
File: `backend/src/main/resources/application.properties`

**PENTING**: Pastikan setting ini ada:
```properties
spring.jpa.hibernate.ddl-auto=update
```

**Jangan** `none` atau `validate`, harus `update` atau `create`!

### Step 3: Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

**Perhatikan log output**, cari baris seperti ini:
```
Hibernate: create table booking (...)
Hibernate: create table customer (...)
Hibernate: create table kamar (...)
```

### Step 4: Verify Tables Created
```sql
USE hotel_booking;
SHOW TABLES;
```

Harusnya ada tables:
- `booking`
- `customer`
- `invoice`
- `kamar`
- `payment`
- `reservasi`
- `users`

## Common Errors

### Error 1: "Access denied for user"
**Problem**: Password salah di `application.properties`
**Fix**: 
```properties
spring.datasource.password=CORRECT_PASSWORD
```

### Error 2: "Unknown database 'hotel_booking'"
**Problem**: Database belum dibuat
**Fix**:
```sql
CREATE DATABASE hotel_booking;
```

### Error 3: Tables tidak terbuat tapi no error
**Problem**: `ddl-auto` di-set ke `none` atau `validate`
**Fix**: Ganti jadi `update`
```properties
spring.jpa.hibernate.ddl-auto=update
```

### Error 4: "Communications link failure"
**Problem**: MySQL service tidak running
**Fix**: Start MySQL service
```bash
# Windows
net start MySQL80

# Or via Services app
```

## Manual Table Creation (Last Resort)

Jika masih gagal, bisa create manual dengan SQL:

```sql
USE hotel_booking;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50)
);

-- Customer table
CREATE TABLE customer (
    customerid BIGINT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255),
    alamat VARCHAR(255),
    telepon VARCHAR(50),
    email VARCHAR(255),
    userid BIGINT,
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- Kamar table
CREATE TABLE kamar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nomor_kamar VARCHAR(50),
    tipe VARCHAR(100),
    harga DOUBLE,
    status_kamar VARCHAR(50),
    fasilitas_tambahan TEXT,
    gambar VARCHAR(500)
);

-- Booking table
CREATE TABLE booking (
    booking_id VARCHAR(50) PRIMARY KEY,
    tanggal_check_in DATE,
    tanggal_check_out DATE,
    status_pembayaran VARCHAR(50),
    nama_pemesan VARCHAR(255),
    tanggal_lahir DATE,
    gender VARCHAR(20),
    tipe_kasur VARCHAR(50),
    sarapan BOOLEAN,
    catatan TEXT,
    customer_customerid BIGINT,
    kamar_id BIGINT,
    FOREIGN KEY (customer_customerid) REFERENCES customer(customerid),
    FOREIGN KEY (kamar_id) REFERENCES kamar(id)
);

-- Payment table
CREATE TABLE payment (
    payment_id VARCHAR(50) PRIMARY KEY,
    tanggal_pembayaran DATE,
    metode_pembayaran VARCHAR(50),
    total_pembayaran DOUBLE,
    booking_booking_id VARCHAR(50),
    FOREIGN KEY (booking_booking_id) REFERENCES booking(booking_id)
);

-- Invoice table
CREATE TABLE invoice (
    invoice_id VARCHAR(50) PRIMARY KEY,
    tanggal_invoice DATE,
    total_harga DOUBLE,
    booking_booking_id VARCHAR(50),
    FOREIGN KEY (booking_booking_id) REFERENCES booking(booking_id)
);

-- Reservasi table (legacy)
CREATE TABLE reservasi (
    reservasiid BIGINT AUTO_INCREMENT PRIMARY KEY,
    tanggal_reservasi DATE,
    tanggal_checkin DATE,
    tanggal_checkout DATE,
    status VARCHAR(50),
    customerid BIGINT,
    kamarid BIGINT,
    FOREIGN KEY (customerid) REFERENCES customer(customerid),
    FOREIGN KEY (kamarid) REFERENCES kamar(id)
);

-- Insert default admin user
INSERT INTO users (email, username, password, role) 
VALUES ('admin@hotel.com', 'admin', 'admin', 'ADMIN');
```

## Verification Checklist

- [ ] Database `hotel_booking` exists
- [ ] `application.properties` has correct password
- [ ] `spring.jpa.hibernate.ddl-auto=update`
- [ ] MySQL service is running
- [ ] Backend runs without errors
- [ ] Tables appear in database
- [ ] Can login with admin@hotel.com / admin

## Still Not Working?

Check backend console log for errors:
```bash
cd backend
./mvnw spring-boot:run -e
```

Look for:
- Connection errors
- Hibernate errors
- SQL syntax errors
