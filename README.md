# Website Parfum - Magang Saptaloka 2025

Full-stack website parfum dengan admin panel. Built sebagai project magang.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js 5.1.0 |
| Database | MySQL + Sequelize 6.37.7 |
| Auth | JWT + bcryptjs |
| Frontend | React 19.1.1 + Vite 7.1.2 |
| Styling | TailwindCSS 4.1.14 |
| i18n | i18next (ID/EN) |

## Fitur

**Public:** Homepage, Produk, Ingredients, Lab Tools, Workshop, Events (registrasi), Artikel, Gallery, About, Multi-language (ID/EN)

**Admin:** JWT auth, Dashboard, CRUD semua konten, File upload, Event management, Content management

## Database Models

User, Product, Ingredient, LabTool, Article, ArticleContent, Event, EventContent, EventRegistration, Workshop, GalleryImage, LandingPage, About

## Setup

### Prerequisites
- Node.js v18+
- MySQL

### Backend

```bash
cd backend
npm install
```

Buat `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=saptaloka_db
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

Jalankan:
```bash
npm start
# atau
npm run dev
```

Seed data:
```bash
node seeders/seedAll.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | - |
| POST | /api/auth/login | - |
| GET | /api/products | - |
| GET | /api/products/:id | - |
| POST | /api/products | JWT |
| PUT | /api/products/:id | JWT |
| DELETE | /api/products/:id | JWT |
| GET | /api/articles | - |
| POST | /api/articles | JWT |
| GET | /api/events | - |
| POST | /api/events | JWT |
| POST | /api/events/:id/register | - |

## Catatan

- MySQL harus running sebelum start backend
- Upload tersimpan di `backend/public/uploads/`
- JWT expiry: 1 hari
- Database auto-sync `alter: true` (hati-hati di production)
