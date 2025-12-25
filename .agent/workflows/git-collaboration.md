---
description: Panduan kolaborasi Git untuk tim hotel-booking
---

# Panduan Kolaborasi Git untuk Project Hotel-Booking

## Untuk Anggota Tim yang Pertama Kali Setup (Leader/Inisiator)

### 1. Inisialisasi Git Repository
```bash
cd "c:\Users\user\Downloads\hotel-booking(yokkk semangat)\hotel-booking"
git init
```

### 2. Buat file .gitignore
Buat file `.gitignore` di root project dengan isi:
```
# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties

# IDE
.idea/
*.iml
.vscode/
.settings/
.classpath
.project
nbproject/
nbbuild/
dist/
nbdist/
.nb-gradle/

# OS
.DS_Store
Thumbs.db

# Application
*.log
application-local.properties
```

### 3. Tambahkan semua file ke Git
```bash
git add .
git commit -m "Initial commit: Hotel booking system"
```

### 4. Buat Repository di GitHub/GitLab
- Buka https://github.com (atau GitLab)
- Klik tombol "New Repository"
- Beri nama: `hotel-booking`
- Jangan centang "Initialize with README" (karena sudah ada local repo)
- Klik "Create Repository"

### 5. Hubungkan Local Repository dengan Remote
```bash
git remote add origin https://github.com/USERNAME/hotel-booking.git
git branch -M main
git push -u origin main
```
*Ganti `USERNAME` dengan username GitHub Anda*

### 6. Invite Anggota Tim
- Di GitHub, buka repository → Settings → Collaborators
- Klik "Add people"
- Masukkan username GitHub anggota tim
- Mereka akan menerima email invitation

---

## Untuk Anggota Tim Lainnya (Clone Repository)

### 1. Clone Repository
```bash
cd "c:\Users\user\Downloads"
git clone https://github.com/USERNAME/hotel-booking.git
cd hotel-booking
```

### 2. Setup Maven Dependencies
```bash
mvn clean install
```

---

## Workflow Kolaborasi Sehari-hari

### Sebelum Mulai Kerja (WAJIB!)
```bash
# Pastikan di branch main
git checkout main

# Ambil perubahan terbaru dari remote
git pull origin main
```

### Saat Mengerjakan Fitur Baru
```bash
# Buat branch baru untuk fitur
git checkout -b fitur-nama-fitur

# Contoh:
# git checkout -b fitur-payment
# git checkout -b fitur-admin-dashboard
# git checkout -b fix-reservasi-bug
```

### Saat Sudah Selesai Coding
```bash
# Cek file yang berubah
git status

# Tambahkan file yang diubah
git add .

# Atau tambahkan file spesifik:
# git add src/main/java/com/pbo/tubes/hotel_booking/controller/ReservasiController.java

# Commit dengan pesan yang jelas
git commit -m "Menambahkan fitur payment gateway"

# Push ke remote
git push origin fitur-nama-fitur
```

### Merge ke Main Branch
```bash
# Pindah ke main
git checkout main

# Update main dengan perubahan terbaru
git pull origin main

# Merge branch fitur
git merge fitur-nama-fitur

# Push ke remote
git push origin main
```

### Atau Gunakan Pull Request (Recommended)
1. Push branch fitur ke GitHub
2. Buka GitHub repository
3. Klik "Pull Request" → "New Pull Request"
4. Pilih branch fitur Anda
5. Tambahkan deskripsi perubahan
6. Request review dari anggota tim
7. Setelah approved, klik "Merge Pull Request"

---

## Tips Menghindari Konflik

### 1. Selalu Pull Sebelum Mulai Kerja
```bash
git pull origin main
```

### 2. Komunikasi dengan Tim
- Koordinasikan siapa mengerjakan file apa
- Hindari 2 orang edit file yang sama secara bersamaan

### 3. Commit Sering
- Jangan tunggu sampai banyak perubahan
- Commit setiap selesai 1 fitur kecil

### 4. Buat Branch untuk Setiap Fitur
- Jangan langsung kerja di branch `main`
- Gunakan branch terpisah untuk setiap fitur

---

## Mengatasi Konflik (Conflict Resolution)

Jika terjadi konflik saat merge:

```bash
# Git akan menandai file yang konflik
git status

# Buka file yang konflik, cari marker:
# <<<<<<< HEAD
# kode versi Anda
# =======
# kode versi orang lain
# >>>>>>> branch-name

# Edit file, pilih kode yang benar atau gabungkan keduanya
# Hapus marker <<<<<<, =======, >>>>>>>

# Setelah selesai edit:
git add nama-file-yang-konflik
git commit -m "Resolve merge conflict"
git push origin main
```

---

## Command Berguna Lainnya

```bash
# Lihat history commit
git log --oneline

# Lihat branch yang ada
git branch -a

# Hapus branch lokal (setelah di-merge)
git branch -d nama-branch

# Lihat perubahan yang belum di-commit
git diff

# Batalkan perubahan file (sebelum commit)
git checkout -- nama-file

# Lihat siapa yang mengubah file
git blame nama-file
```

---

## Struktur Branch yang Disarankan

```
main (production-ready code)
├── develop (development branch)
│   ├── fitur-reservasi
│   ├── fitur-payment
│   ├── fitur-admin
│   └── fix-bug-login
```

**Best Practice:**
- `main`: Hanya untuk kode yang sudah siap production
- `develop`: Branch utama untuk development
- `fitur-*`: Branch untuk fitur baru
- `fix-*`: Branch untuk bug fixes

---

## Troubleshooting

### Error: "Permission denied"
- Pastikan sudah di-invite sebagai collaborator
- Atau gunakan SSH key untuk authentication

### Error: "Merge conflict"
- Lihat section "Mengatasi Konflik" di atas

### Error: "Your branch is behind"
```bash
git pull origin main
```

### Lupa di branch mana
```bash
git branch
# Branch dengan tanda * adalah branch aktif
```
