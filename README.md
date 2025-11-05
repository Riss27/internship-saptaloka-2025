# 🌸 Rebuild Website Parfum – Magang Saptaloka 2025

Project magang untuk **rebuild website parfum**, dengan fokus pada pembelajaran backend dan frontend modern.

## 🎯 Tujuan
- Membangun ulang website parfum dengan desain modern dan performa optimal.  
- Mempelajari dasar-dasar pengembangan backend & frontend.  
- Menerapkan praktik terbaik dalam struktur kode dan workflow pengembangan.

## 📋 Deskripsi Proyek

Website parfum full-stack dengan fitur lengkap untuk menampilkan produk, artikel, event, workshop, dan galeri. Dilengkapi dengan admin panel untuk mengelola konten secara dinamis.

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MySQL** - Database
- **Sequelize 6.37.7** - ORM
- **JWT** - Authentication
- **Multer** - File upload
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.2** - Build tool
- **TailwindCSS 4.1.14** - Styling
- **React Router DOM 7.9.2** - Routing
- **i18next** - Internationalization (ID/EN)
- **TipTap** - Rich text editor
- **Framer Motion** - Animations
- **Axios** - HTTP client

## ✨ Fitur Utama

### Halaman Publik
- 🏠 **Homepage** - Landing page dengan carousel, featured products, recent activities
- 📦 **Products** - Katalog produk parfum & aromaterapi dengan detail
- 🧪 **Ingredients** - Daftar bahan baku parfum & aromaterapi
- 🔬 **Lab Tools** - Peralatan laboratorium
- 🎓 **Workshops** - Workshop Aromaterapi & Parfum
- 📅 **Events** - Daftar kegiatan/event dengan sistem registrasi
- 📝 **Articles** - Blog/artikel dengan rich text editor
- 🖼️ **Gallery** - Galeri foto kegiatan
- ℹ️ **About** - Halaman tentang perusahaan
- 🌐 **Multi-language** - Bahasa Indonesia & Inggris

### Admin Panel
- 🔐 **Authentication** - Login dengan JWT
- 📊 **Dashboard** - Overview konten
- ✏️ **CRUD Operations** - Kelola semua konten (Products, Ingredients, Lab Tools, Articles, Events, Workshops, Gallery)
- 📤 **File Upload** - Upload gambar dengan validasi
- 👥 **Event Management** - Kelola event & lihat pendaftar
- 📄 **Content Management** - Kelola landing page & about page

## 📁 Struktur Proyek

```
internship-saptaloka-2025/
├── backend/
│   ├── config/          # Konfigurasi database
│   ├── controllers/     # Business logic (11 controllers)
│   ├── middlewares/     # Auth, upload, validators
│   ├── models/          # Database models (13 models)
│   ├── routes/          # API routes
│   ├── services/        # Business services
│   ├── seeders/         # Database seeders
│   ├── public/          # Static files & uploads
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/          # Static assets & translations
    ├── src/
    │   ├── admin/       # Admin pages & components
    │   ├── components/  # Reusable components
    │   │   ├── atoms/   # Atomic components
    │   │   ├── molecules/  # Molecule components
    │   │   └── organisms/  # Organism components
    │   ├── context/     # React context (Auth)
    │   ├── hooks/       # Custom hooks
    │   ├── layouts/     # Layout components
    │   ├── pages/       # Public pages
    │   └── App.jsx      # Main app component
    └── vite.config.js
```

## 🗄️ Database Models

1. **User** - Admin/user authentication
2. **Product** - Produk parfum & aromaterapi
3. **Ingredient** - Bahan baku parfum
4. **LabTool** - Peralatan laboratorium
5. **Article** - Artikel/blog
6. **ArticleContent** - Konten artikel (multi-language)
7. **Event** - Event/kegiatan
8. **EventContent** - Konten event (multi-language)
9. **EventRegistration** - Pendaftaran event
10. **Workshop** - Workshop parfum & aromaterapi
11. **GalleryImage** - Gambar galeri
12. **LandingPage** - Konten homepage
13. **About** - Konten halaman about

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v18+)
- MySQL
- npm atau yarn

### Backend Setup

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=saptaloka_db
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

Jalankan server:
```bash
node server.js
# atau
npm start
```

Server akan berjalan di `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Database Setup

Database akan otomatis di-sync saat server backend dijalankan (dengan `sequelize.sync({ alter: true })`).

Untuk seed data awal:
```bash
cd backend
node seeders/seedAll.js
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin baru
- `POST /api/auth/login` - Login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article (protected)
- `PUT /api/articles/:id` - Update article (protected)
- `DELETE /api/articles/:id` - Delete article (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (protected)
- `POST /api/events/:id/register` - Register to event
- `GET /api/events/:id/registrations` - Get event registrations (protected)

*Dan masih banyak lagi...*

## 🔒 Security Features

- ✅ Password hashing dengan bcryptjs
- ✅ JWT authentication
- ✅ Protected routes dengan middleware
- ✅ Input validation dengan Express Validator
- ✅ File upload validation (type & size)

## 🎨 UI/UX Features

- ✅ Modern & responsive design dengan TailwindCSS
- ✅ Smooth animations dengan Framer Motion
- ✅ Loading states untuk better UX
- ✅ Real-time search functionality
- ✅ Multi-language support (ID/EN)
- ✅ Rich text editor untuk artikel
- ✅ Image lazy loading

## 📝 Catatan Penting

- Pastikan MySQL sudah running sebelum menjalankan backend
- File upload akan tersimpan di `backend/public/uploads/`
- Token JWT berlaku selama 1 hari
- Database auto-sync dengan `alter: true` (hati-hati di production)



## 👨‍💻 Developer

Project magang Saptaloka 2025