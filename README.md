# Hotel Booking System - Kanzler

Sistem manajemen hotel booking dengan fitur admin panel dan customer booking flow.

## Tech Stack

### Backend
- **Java 8+** (Spring Boot 2.7.18)
- **MySQL 8.0**
- **Maven** (Maven Wrapper included)

### Frontend
- **Next.js 14** (React)
- **TypeScript**
- **Tailwind CSS** (via vanilla CSS)

## Prerequisites

Pastikan sudah terinstall:
- Java JDK 8 atau lebih tinggi
- MySQL 8.0
- Node.js 18+ dan npm
- Git

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd hotel-booking
```

### 2. Setup Database

**Buat database MySQL:**
```sql
CREATE DATABASE hotel_booking;
```

**Buat user (opsional, bisa pakai root):**
```sql
CREATE USER 'hotel_admin'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON hotel_booking.* TO 'hotel_admin'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Backend

**Copy file konfigurasi:**
```bash
cd backend/src/main/resources
cp application.properties.example application.properties
```

**Edit `application.properties`:**
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Ganti `YOUR_MYSQL_PASSWORD` dengan password MySQL Anda.

### 4. Install Dependencies

**Backend:**
```bash
cd backend
./mvnw clean install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Run Application

**Opsi 1: Run keduanya sekaligus (Windows)**
```bash
# Dari root folder
start_all.bat
```

**Opsi 2: Run manual**

Terminal 1 (Backend):
```bash
cd backend
./mvnw spring-boot:run
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **Admin Panel**: http://localhost:3000/admin

## Default Credentials

**Admin:**
- Email: `admin@hotel.com`
- Password: `admin`

## Project Structure

```
hotel-booking/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Config & static files
│   └── pom.xml
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── lib/              # Utilities
├── start_all.bat         # Windows startup script
└── README.md
```

## Features

### Customer Features
- Browse available rooms
- Book rooms with date selection
- View booking cart
- QRIS payment simulation
- View booking history

### Admin Features
- Dashboard with statistics
- Room management (CRUD)
- Booking management
- Edit booking dates (reschedule)
- View revenue reports
- Search bookings

## Database Schema

Tables akan otomatis dibuat oleh Hibernate saat pertama kali run:
- `users` - User accounts
- `customer` - Customer profiles
- `kamar` - Room data
- `booking` - Booking records
- `payment` - Payment records
- `invoice` - Invoice records
- `reservasi` - Legacy reservations

## API Endpoints

### Public
- `GET /api/public/kamar` - Get all rooms

### Customer
- `POST /api/customer/booking` - Create booking
- `GET /api/customer/booking/latest` - Get latest booking
- `PUT /api/customer/booking/{id}/details` - Update booking details
- `PUT /api/customer/booking/{id}/pay` - Process payment

### Admin
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/{id}/assign-room/{roomId}` - Assign room
- `PUT /api/admin/bookings/{id}/update-dates` - Update booking dates
- `GET /api/admin/kamar` - Get all rooms (admin)
- `POST /api/admin/kamar` - Create room
- `PUT /api/admin/kamar/{id}` - Update room
- `DELETE /api/admin/kamar/{id}` - Delete room

## Troubleshooting

### Port 8081 already in use
```bash
# Windows
netstat -ano | findstr :8081
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:8081 | xargs kill -9
```

### MySQL Connection Error
- Pastikan MySQL service running
- Cek username/password di `application.properties`
- Pastikan database `hotel_booking` sudah dibuat

### Frontend tidak bisa connect ke backend
- Pastikan backend running di port 8081
- Cek CORS configuration di backend
- Cek `lib/api.ts` baseURL

## Development Workflow

### Git Collaboration
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m "feat: deskripsi"`
4. Push: `git push origin feature/nama-fitur`
5. Create Pull Request

### Database Changes
- **Schema changes**: Otomatis handled oleh Hibernate
- **Data**: Tidak di-sync via Git (lokal per developer)
- Jika perlu seed data, tambahkan di `data.sql`

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

Private project - Tugas PBO

## Contact

Untuk pertanyaan atau issue, hubungi team developer.
