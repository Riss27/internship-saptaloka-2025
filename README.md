<div align="center">

<img src="frontend/public/Assets/asklogo1.png" alt="Logo Askreative Parfum" width="140">

# Askreative Parfum

**Katalog parfum & aromatherapy — bahan, alat lab, workshop, dan event dalam satu situs.**

Magang Saptaloka 2025 · full-stack · admin panel · i18n ID/EN

<p>
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js >= 18">
  <img src="https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express&logoColor=white" alt="Express 5.1">
  <img src="https://img.shields.io/badge/MySQL-Sequelize-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL + Sequelize">
  <img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS 4">
</p>

</div>

## Tentang

Situs katalog untuk brand parfum & aromatherapy: pengunjung bisa telusuri produk parfum, bahan (*ingredients*), alat laboratorium, workshop, event (plus registrasi publik), artikel, dan galeri. Di baliknya ada admin panel untuk mengelola semua konten itu, dan seluruh antarmuka bisa ditampil-terjemahkan ID/EN lewat i18next.

## Fitur

**Publik**

- Homepage, katalog Produk, Ingredients, Lab Tools
- Workshop, Event + registrasi publik, Artikel, Gallery, About
- Multi-bahasa ID/EN (i18next)

**Admin**

- Login JWT, CRUD semua konten
- Upload gambar dengan whitelist MIME/ukuran
- Manajemen event + daftar pendaftar
- Editor rich-text (Tiptap)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js >= 18 |
| Backend | Express 5.1 + Helmet + Compression |
| Database | MySQL + Sequelize 6 (sync otomatis non-production) |
| Auth | JWT (HS256, expiry 1 hari) + bcryptjs |
| Rate limit | express-rate-limit (login, register, event, translate) |
| Frontend | React 19 + Vite 7 + TailwindCSS 4 |
| Routing | React Router 7 (code splitting per halaman via `React.lazy`) |
| i18n | i18next (ID/EN) |
| Image | sharp (kompresi & orientasi otomatis saat upload) |
| Testing | `node:test` + Supertest (6 smoke test) |

## Arsitektur

Monorepo dua bagian:

- `backend/` — Express + Sequelize, base URL `http://localhost:3000/api`
- `frontend/` — React + Vite, dev server `http://localhost:5173`

Upload gambar tersimpan di `backend/public/uploads/` dan dilayani backend. Terjemahan halaman lewat endpoint `translate` (dipanggil i18next-http-backend dari frontend).

## Setup

### Prasyarat

- Node.js v18+
- MySQL berjalan

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env   # Windows: cp .env.example .env di Linux/Mac
```

Isi `.env` (lihat `.env.example`): `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME`, `JWT_SECRET`
(generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`),
`ADMIN_EMAIL`/`ADMIN_PASSWORD` (untuk seeder).

```bash
npm run seed   # buat akun admin dari ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev    # development (nodemon) — atau: npm start
```

#### Langkah rilis satu kali (backend)

Setelah deploy perubahan backend, jalankan sekali dari `backend/` **sebelum**
melayani trafik:

```bash
node scripts/add-sort-order.js
```

Skrip ini menambahkan kolom `sortOrder` pada tabel landing page dan galeri,
lalu mengisi ulang urutan (backfill) agar urutan publik lama tetap sama.
**Peringatan:** menjalankannya lagi akan mereset urutan manual yang sudah diatur
admin lewat `PATCH /api/landing-page/order` dan `PATCH /api/gallery/order`
(peringatan keras juga ada di dalam skrip).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

`VITE_API_URL` opsional di `frontend/.env` (default `http://localhost:3000`).

## Scripts

| Loc | Perintah | Fungsi |
|-----|----------|--------|
| backend | `npm start` / `npm run dev` | jalankan server / nodemon |
| backend | `npm run seed` | seeding admin (butuh `ADMIN_*` di `.env`) |
| backend | `npm test` | 6 smoke test (butuh MySQL aktif) |
| frontend | `npm run dev` / `build` / `lint` | dev server / build produksi / ESLint |
| frontend | `npm run preview:dist` | sajikan build produksi terkompresi gzip (audit Lighthouse) |

## API

- Base: `http://localhost:3000/api`
- Auth: header `Authorization: Bearer <token>` (login `POST /api/auth/login`)
- **Pagination opt-in**: `GET /api/products?page=1&limit=12` mengembalikan
  `meta: { page, limit, total, totalPages }`. Tanpa `?page`, daftar penuh (lama).

<details>
<summary>Endpoint utama</summary>

`auth`, `products`, `ingredients`, `lab-tools`, `workshops`,
`events` (+ `/:id/register`, admin `/:id/registrations`), `articles`, `gallery`,
`about`, `categories`, `landing-page`, `translate`

</details>

## Performance & Upload Otomatis

- **Kompresi gambar saat upload (sharp).** Gambar divalidasi lewat metadata sharp — file rusak atau bukan gambar ditolak `400`. Orientasi EXIF dibake, GIF & WebP animasi dilewatkan tanpa diubah, sisanya di-resize maksimal 1600px (tanpa perbesaran) menjadi WebP q80. Hasil hanya disimpan jika lebih kecil dari asli, jadi upload tidak pernah memperbesar file. Terukur: JPEG 4.082.825 B → WebP 36.360 B.
- **Cache gambar**: `Cache-Control: public, max-age=604800` (7 hari).
- **Font Inter self-hosted** — tidak lagi dimuat dari pihak ketiga.
- **`npm run preview:dist`** di frontend menyajikan build produksi terkompresi gzip (script stdlib `frontend/scripts/serve-dist.mjs`) — untuk audit Lighthouse yang representatif.
- **Lighthouse Desktop** terukur di jalur production: **96–98** (LCP ~0,9–1,3 detik, CLS 0,075).

## Keamanan

- Helmet + CORS whitelist (`CORS_ORIGINS`), rate limit login/register/event/translate
- JWT ditandatangani & diverifikasi dipaksa algoritma `HS256`
- Endpoint publik event hanya mengirim `registeredCount` — data pendaftar (nama/email/telepon) hanya lewat route admin terproteksi
- Pesan error 500 generik ke client, detail di-log server-side
- Upload: whitelist MIME/ekstensi presisi, batas 5 MB, hapus file dengan guard anti path-traversal
- Whitelist field pada update (anti mass assignment); sub-konten di-write dengan `bulkCreate` dalam transaksi
- File lama dihapus **setelah** commit — rollback tidak menghilangkan file yang masih dirujuk DB

## Testing

```bash
cd backend
npm test        # node --test, Supertest langsung ke app (tanpa listen port)
```

<details>
<summary>Apa yang dicover</summary>

Menutup: list + pagination, proteksi PII event, 404 API, login gagal.
Rate limit otomatis nonaktif saat `NODE_ENV=test`.

</details>

## Catatan

- Skema auto-sync `sync({ alter: true })` hanya non-production; production pakai migration.
- Upload tersimpan di `backend/public/uploads/` (tidak di-track git).
- `npm audit`: `uuid` via sequelize sudah ditangani dengan override `^11.1.1`; tersisa `braces` via nodemon (dev-only, advisory berlaku untuk semua versi). Frontend: 1 low di `i18next-http-backend` (butuh major bump).

---

Dibuat untuk magang **Saptaloka 2025** · [Riss27/internship-saptaloka-2025](https://github.com/Riss27/internship-saptaloka-2025)
