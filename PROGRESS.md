# Progress Update — AanStore

Terakhir diperbarui: 2026-09-01

Ringkasan status saat ini (commit telah dipush ke repo):

1) Apa yang sudah ada di repo (main)
- Backend scaffold lengkap dengan banyak route: auth (login/refresh/change-password), users management, products, variants, units (IMEI), stock (balances & movements), purchases, sales (POS), cashbook, audit util.
- Prisma schema, seed script, Dockerfile & docker-compose.
- OpenAPI skeleton di backend/docs/openapi.yaml dan Swagger di /api/docs.
- Frontend scaffold Flutter dengan tema, logo (assets/logo.svg), halaman Login & Dashboard stub, pengaturan assets.

2) Status pekerjaan yang sedang berjalan
- Backend core: banyak endpoint sudah tersedia (lihat di folder backend/src/routes). Beberapa bagian sudah berfungsi dan bisa diuji secara lokal.
- Frontend: scaffold dan tema sudah siap; integrasi ke API (auth, POS, produk list) masih dalam pengerjaan.

3) Apa yang akan saya kerjakan sekarang (prioritas)
- Selesaikan endpoints yang tersisa dan perbaikan validasi/error handling untuk backend (selesai dalam 2-3 hari kerja). Ini termasuk: lengkapkan CRUD produk & variant, stock movement edge-cases, sales transactions atomic behavior, dan laporan dasar.
- Integrasi frontend -> API: login, token refresh, list produk, POS keranjang & checkout (3-7 hari berikutnya).
- Generate nota PDF, laporan penjualan & stok, rekonsiliasi kas, backup & deploy docs (setelah frontend selesai).

4) Cara menjalankan saat ini (quick start)
- Clone repo: git clone https://github.com/afarhnn/aanstore.git
- Jalankan: docker compose up --build
- Setup backend:
  cd backend
  npm install
  npx prisma migrate dev --name init
  npm run seed
- API base: http://localhost:4000 ; Swagger: http://localhost:4000/api/docs

5) Catatan penting
- Ganti JWT_SECRET di backend/.env sebelum deploy ke production.
- Ubah password admin default segera lewat endpoint change-password setelah login.

6) Saya telah mulai kembali kerja sekarang — akan push perubahan berkala ke branch `main`.

Jika Anda ingin saya prioritaskan fitur tertentu (mis. POS mobile-only, atau laporan keuangan lengkap dahulu), beri tahu. Kalau tidak, saya lanjutkan sesuai rencana MVP dan saya akan laporkan kembali setelah milestone backend core selesai.
