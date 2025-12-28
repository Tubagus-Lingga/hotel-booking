# 🚀 Cara Running Server - Backend & Frontend

## Opsi 1: Run Keduanya Sekaligus (RECOMMENDED - Windows)

### Dari root folder project:
```bash
start_all.bat
```

**Ini akan:**
- ✅ Otomatis buka 2 terminal windows
- ✅ Terminal 1: Run backend (Spring Boot)
- ✅ Terminal 2: Run frontend (Next.js)

**Tunggu sampai:**
- Backend: `Started HotelBookingApplication in X seconds`
- Frontend: `Ready in X ms`

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081

---

## Opsi 2: Run Manual (Semua OS)

### Terminal 1 - Backend:
```bash
cd backend
./mvnw spring-boot:run
```

**Windows:**
```bash
cd backend
mvnw.cmd spring-boot:run
```

**Tunggu sampai muncul:**
```
Started HotelBookingApplication in 3.5 seconds
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.1s
○ Local: http://localhost:3000
```

---

## First Time Setup (PENTING!)

### 1. Install Dependencies

**Backend (Maven):**
```bash
cd backend
./mvnw clean install
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
```

### 2. Setup Database
```sql
CREATE DATABASE hotel_booking;
```

### 3. Configure application.properties
```bash
cd backend/src/main/resources
copy application.properties.example application.properties
```

Edit `application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## Troubleshooting

### ❌ "Port 8081 already in use"
```bash
# Windows
netstat -ano | findstr :8081
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:8081 | xargs kill -9
```

### ❌ "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### ❌ "mvnw: command not found"
```bash
# Windows - gunakan:
mvnw.cmd spring-boot:run

# Linux/Mac - beri permission:
chmod +x mvnw
./mvnw spring-boot:run
```

### ❌ "npm: command not found"
Install Node.js dari: https://nodejs.org/

### ❌ Backend error "Access denied"
Cek password di `application.properties`

### ❌ Frontend error "Cannot connect to backend"
Pastikan backend sudah running di port 8081

---

## Stop Server

### Stop dengan Ctrl+C
Di terminal yang running, tekan:
```
Ctrl + C
```

### Force Stop (Windows)
```bash
# Backend
taskkill /F /IM java.exe

# Frontend
taskkill /F /IM node.exe
```

---

## Development Workflow

### 1. Pull Latest Code
```bash
git pull origin main
```

### 2. Install New Dependencies (jika ada update)
```bash
# Backend
cd backend
./mvnw clean install

# Frontend
cd frontend
npm install
```

### 3. Run Servers
```bash
start_all.bat
```

### 4. Start Coding!
- Backend code: `backend/src/main/java/`
- Frontend code: `frontend/app/`

### 5. Test Changes
- Backend: Restart server (Ctrl+C, run lagi)
- Frontend: Auto-reload (save file aja)

---

## Quick Reference

| Task | Command |
|------|---------|
| Run both | `start_all.bat` |
| Run backend only | `cd backend && ./mvnw spring-boot:run` |
| Run frontend only | `cd frontend && npm run dev` |
| Install backend deps | `cd backend && ./mvnw clean install` |
| Install frontend deps | `cd frontend && npm install` |
| Stop server | `Ctrl + C` |
| Check backend running | http://localhost:8081 |
| Check frontend running | http://localhost:3000 |

---

## First Run Checklist

- [ ] MySQL service running
- [ ] Database `hotel_booking` created
- [ ] `application.properties` configured with password
- [ ] Backend dependencies installed (`mvnw clean install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Port 8081 available (backend)
- [ ] Port 3000 available (frontend)
- [ ] Run `start_all.bat` or manual run
- [ ] Access http://localhost:3000
- [ ] Login with admin@hotel.com / admin

---

## Success Indicators

### Backend Running Successfully:
```
Started HotelBookingApplication in 3.5 seconds (JVM running for 3.8)
Tomcat started on port(s): 8081 (http)
```

### Frontend Running Successfully:
```
✓ Ready in 2.1s
○ Local: http://localhost:3000
```

### Database Tables Created:
```sql
SHOW TABLES;
-- Should show: booking, customer, invoice, kamar, payment, reservasi, users
```

---

## Need Help?

1. Check `DATABASE_TROUBLESHOOTING.md` untuk database issues
2. Check `README.md` untuk dokumentasi lengkap
3. Check console logs untuk error messages
4. Pastikan semua prerequisites terinstall (Java, MySQL, Node.js)
