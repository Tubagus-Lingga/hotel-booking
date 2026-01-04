# Quick Setup Guide - Hotel Booking System

## 🚀 Setup Cepat (5 Menit)

### 1️⃣ Install Prerequisites
- ✅ Java JDK 8+
- ✅ MySQL 8.0
- ✅ Node.js 18+

### 2️⃣ Setup Database
```sql
CREATE DATABASE hotel_booking;
```

### 3️⃣ Configure Backend
```bash
cd backend/src/main/resources
copy application.properties.example application.properties
```

**Edit `application.properties`** - ganti password MySQL:
```properties
spring.datasource.password=YOUR_PASSWORD
```

### 4️⃣ Install & Run
```bash
# Install dependencies
cd backend
./mvnw clean install

cd ../frontend
npm install

# Run aplikasi (dari root folder)
start_all.bat
```

### 5️⃣ Access
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
  - Email: `admin@hotel.com`
  - Password: `admin`

## ⚠️ Troubleshooting

**Port 8081 sudah dipakai:**
```bash
netstat -ano | findstr :8081
taskkill /F /PID <PID>
```

**MySQL connection error:**
- Cek MySQL service running
- Cek password di `application.properties`

## 📝 Important Notes

- **Database schema** otomatis dibuat oleh Hibernate
- **Data** tidak di-sync via Git (lokal per laptop)
- **Uploads folder** tidak di-commit (user uploaded images)
- Jangan commit file `application.properties` (sudah di `.gitignore`)

## 🔄 Git Workflow

```bash
# Pull latest
git pull origin main

# Create branch
git checkout -b feature/nama-fitur

# Commit & push
git add .
git commit -m "feat: deskripsi"
git push origin feature/nama-fitur
```

## 📚 Full Documentation
Lihat `README.md` untuk dokumentasi lengkap.
