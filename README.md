# AanStore - MVP Sistem Penjualan Handphone

Repository ini adalah scaffold awal untuk aplikasi penjualan handphone (web + Android/iOS) — backend Node.js + TypeScript + Express + Prisma (Postgres) dan frontend Flutter (multi-platform).

Nama Toko: AanStore

Tujuan: menyediakan MVP yang rapi dan sederhana untuk kasir, manajemen stok, dan pencatatan keuangan manual.

Struktur utama:
- backend/ — API server (TypeScript + Express + Prisma)
- frontend/ — Flutter app (web + Android + iOS)
- docker-compose.yml — layanan: db, api

Instruksi singkat (lokal, Docker):
1. Copy file backend/.env.example ke backend/.env dan lengkapi jika perlu.
2. Jalankan: docker compose up --build
3. Backend akan tersedia di http://localhost:4000
4. Flutter: buka frontend/ di VS Code atau Android Studio, jalankan `flutter pub get` lalu `flutter run -d chrome` atau device Anda.

Admin seed (default):
- email: admin@aanstore.local
- password: Admin123!

Catatan: Ini scaffold awal. Saya akan terus menambah fitur, endpoint, dan UI/UX sesuai rencana MVP.

Logo: taruh file logo di `frontend/assets/logo.png` (opsional). Jika Anda ingin saya tambahkan logo yang Anda kirim, konfirmasi dan saya akan uploadkan.
