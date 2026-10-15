# Website Parfum & Laboratorium — Askreative (Magang Saptaloka 2025)

Full-stack website katalog (parfum, bahan, alat lab), workshop, event, dan artikel — dengan admin panel, i18n ID/EN, dan API terpublikasi.

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
| Testing | `node:test` + Supertest (6 smoke test) |

## Fitur

**Publik:** Homepage, Produk, Ingredients, Lab Tools, Workshop, Event + registrasi, Artikel, Gallery, About, multi-bahasa.

**Admin:** login JWT, CRUD semua konten, upload gambar (whitelist MIME/ukuran), manajemen event + daftar pendaftar, editor rich-text (Tiptap).

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

## API

- Base: `http://localhost:3000/api`
- Auth: header `Authorization: Bearer <token>` (login `POST /api/auth/login`)
- **Pagination opt-in**: `GET /api/products?page=1&limit=12` mengembalikan
  `meta: { page, limit, total, totalPages }`. Tanpa `?page`, daftar penuh (lama).
- Endpoint utama: `auth`, `products`, `ingredients`, `lab-tools`, `workshops`,
  `events` (+ `/:id/register`, admin `/:id/registrations`), `articles`, `gallery`,
  `about`, `categories`, `landing-page`, `translate`

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

Menutup: list + pagination, proteksi PII event, 404 API, login gagal. Rate limit otomatis nonaktif saat `NODE_ENV=test`.

## Catatan

- Skema auto-sync `sync({ alter: true })` hanya non-production; production pakai migration.
- Upload tersimpan di `backend/public/uploads/` (tidak di-track git).
- `npm audit` sisa: `braces` via nodemon (dev-only, advisory berlaku untuk semua versi) dan `uuid` via sequelize (jalur pemakaian tidak terjangkau); frontend: 1 low di `i18next-http-backend` (butuh major bump).
