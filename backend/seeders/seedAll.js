require('dotenv').config();

const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const LabTool = require('../models/LabTool');
const Article = require('../models/Article');
const ArticleContent = require('../models/ArticleContent');
const Event = require('../models/Event');
const EventContent = require('../models/EventContent');
const Workshop = require('../models/Workshop');
const GalleryImage = require('../models/GalleryImage');
const Category = require('../models/Category');
const About = require('../models/About');
const LandingPage = require('../models/LandingPage');
const User = require('../models/User');
const sequelize = require('../config/database');

// Produk Dummy
const generateDummyProducts = (count, startIndex) => {
  const products = [];
  const categories = ['Parfum', 'Aromaterapi'];

  for (let i = startIndex; i < startIndex + count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    products.push({
      name: `Produk Dummy ${i}`,
      description: `Deskripsi produk dummy ke-${i}. Termasuk dalam kategori ${category}.`,
      price: Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000,
      category: category,
      imageUrl: '/uploads/placeholder-product.jpg',
      linkTokopedia: `https://tokopedia.com/produk-${i}`,
      linkShopee: `https://shopee.co.id/produk-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return products;
};

// Bahan Dummy
const generateDummyIngredients = (count, startIndex) => {
  const ingredients = [];
  const categories = ['Essential Oil', 'Non Essential Oil'];

  for (let i = startIndex; i < startIndex + count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    ingredients.push({
      name: `Bahan Dummy ${i}`,
      description: `Deskripsi bahan dummy ke-${i}. Termasuk kategori ${category}.`,
      price: Math.floor(Math.random() * (100000 - 20000 + 1)) + 20000,
      category: category,
      imageUrl: '/uploads/placeholder-product.jpg',
      linkTokopedia: `https://tokopedia.com/bahan-${i}`,
      linkShopee: `https://shopee.co.id/bahan-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return ingredients;
};

// Alat Laboratorium Dummy
const generateDummyLabTools = (count, startIndex) => {
  const labTools = [];

  for (let i = startIndex; i < startIndex + count; i++) {
    labTools.push({
      name: `Alat Lab Dummy ${i}`,
      description: `Deskripsi alat laboratorium dummy ke-${i}.`,
      price: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
      imageUrl: '/uploads/placeholder-product.jpg',
      linkTokopedia: `https://tokopedia.com/alat-${i}`,
      linkShopee: `https://shopee.co.id/alat-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return labTools;
};

const seed = async () => {
  const itemsToAdd = 10; // jumlah data dummy per tabel

  try {
    // ----------------- User Admin -----------------
    console.log('\n=== Memulai proses seeding untuk User ===');
    const existingUser = await User.findOne({ where: { email: 'admin@ask.com' } });
    if (!existingUser) {
      await User.create({
        name: 'Admin ASK',
        email: 'admin@ask.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ User admin berhasil dibuat (email: admin@ask.com, password: admin123)');
    } else {
      console.log('ℹ️ User admin sudah ada');
    }

    // ----------------- Categories -----------------
    console.log('\n=== Memulai proses seeding untuk Category ===');
    const categories = ['Parfum', 'Aromaterapi', 'Essential Oil', 'Non Essential Oil'];
    for (const cat of categories) {
      await Category.findOrCreate({ where: { name: cat } });
    }
    console.log('✅ Kategori berhasil dibuat');

    // ----------------- Landing Page -----------------
    console.log('\n=== Memulai proses seeding untuk Landing Page ===');
    const existingLanding = await LandingPage.count();
    if (existingLanding === 0) {
      await LandingPage.create({
        heading: 'Welcome to ASK Laboratory',
        paragraph: 'Kami menyediakan produk aromaterapi dan parfum berkualitas tinggi dengan bahan-bahan pilihan. Temukan produk terbaik untuk kebutuhan Anda.',
        imageUrl: '/uploads/placeholder-product.jpg'
      });
      console.log('✅ Landing page berhasil dibuat');
    } else {
      console.log('ℹ️ Landing page sudah ada');
    }

    // ----------------- About -----------------
    console.log('\n=== Memulai proses seeding untuk About ===');
    const existingAbout = await About.count();
    if (existingAbout === 0) {
      await About.create({
        about: 'ASK Laboratory adalah perusahaan yang bergerak di bidang aromaterapi dan parfum. Kami berkomitmen untuk menyediakan produk berkualitas tinggi dengan harga terjangkau.',
        address: 'Jl. Contoh No. 123, Jakarta',
        phone: '021-12345678',
        email: 'info@ask.com',
        instagram: '@asklaboratory',
        whatsapp: '081234567890',
        logoFooter: '/uploads/placeholder-product.jpg'
      });
      console.log('✅ About page berhasil dibuat');
    } else {
      console.log('ℹ️ About page sudah ada');
    }

    // ----------------- Produk -----------------
    console.log('\n=== Memulai proses seeding untuk Product ===');
    const existingProductCount = await Product.count();
    console.log(`Data produk saat ini: ${existingProductCount}`);

    const productStartIndex = existingProductCount + 1;
    console.log(`Menambahkan ${itemsToAdd} produk baru...`);
    const dummyProducts = generateDummyProducts(itemsToAdd, productStartIndex);
    await Product.bulkCreate(dummyProducts);

    console.log(`✅ Berhasil menambahkan ${itemsToAdd} produk. Total sekarang: ${existingProductCount + itemsToAdd}`);

    // ----------------- Bahan -----------------
    console.log('\n=== Memulai proses seeding untuk Ingredient ===');
    const existingIngredientCount = await Ingredient.count();
    console.log(`Data bahan saat ini: ${existingIngredientCount}`);

    const ingredientStartIndex = existingIngredientCount + 1;
    console.log(`Menambahkan ${itemsToAdd} bahan baru...`);
    const dummyIngredients = generateDummyIngredients(itemsToAdd, ingredientStartIndex);
    await Ingredient.bulkCreate(dummyIngredients);

    console.log(`✅ Berhasil menambahkan ${itemsToAdd} bahan. Total sekarang: ${existingIngredientCount + itemsToAdd}`);

    // ----------------- Alat Laboratorium -----------------
    console.log('\n=== Memulai proses seeding untuk LabTool ===');
    const existingLabToolCount = await LabTool.count();
    console.log(`Data alat lab saat ini: ${existingLabToolCount}`);

    const labToolStartIndex = existingLabToolCount + 1;
    console.log(`Menambahkan ${itemsToAdd} alat laboratorium baru...`);
    const dummyLabTools = generateDummyLabTools(itemsToAdd, labToolStartIndex);
    await LabTool.bulkCreate(dummyLabTools);

    console.log(`✅ Berhasil menambahkan ${itemsToAdd} alat lab. Total sekarang: ${existingLabToolCount + itemsToAdd}`);

    // ----------------- Articles -----------------
    console.log('\n=== Memulai proses seeding untuk Article ===');
    const existingArticleCount = await Article.count();
    if (existingArticleCount === 0) {
      const article1 = await Article.create({
        title: 'Manfaat Aromaterapi untuk Kesehatan Mental',
        author: 'Dr. Sarah Johnson',
        mainDescription: 'Aromaterapi telah digunakan selama berabad-abad untuk meningkatkan kesehatan mental dan fisik. Penelitian modern menunjukkan bahwa minyak esensial dapat membantu mengurangi stres, kecemasan, dan meningkatkan kualitas tidur.',
        featuredImageUrl: '/uploads/placeholder-product.jpg',
        publishedAt: new Date()
      });

      await ArticleContent.bulkCreate([
        {
          ArticleId: article1.id,
          topic: 'Mengurangi Stres dan Kecemasan',
          description: 'Minyak esensial seperti lavender dan chamomile terbukti efektif dalam mengurangi tingkat stres dan kecemasan. Aroma yang menenangkan dapat membantu merilekskan sistem saraf.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        },
        {
          ArticleId: article1.id,
          topic: 'Meningkatkan Kualitas Tidur',
          description: 'Penggunaan aromaterapi sebelum tidur dapat membantu meningkatkan kualitas tidur. Minyak lavender khususnya sangat efektif untuk mengatasi insomnia.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        }
      ]);

      const article2 = await Article.create({
        title: 'Cara Membuat Parfum Natural di Rumah',
        author: 'Michael Chen',
        mainDescription: 'Membuat parfum sendiri di rumah adalah cara yang menyenangkan dan kreatif untuk mengekspresikan kepribadian Anda. Dengan bahan-bahan alami, Anda dapat menciptakan aroma unik yang sesuai dengan selera.',
        featuredImageUrl: '/uploads/placeholder-product.jpg',
        publishedAt: new Date()
      });

      await ArticleContent.bulkCreate([
        {
          ArticleId: article2.id,
          topic: 'Bahan-bahan yang Dibutuhkan',
          description: 'Untuk membuat parfum natural, Anda memerlukan minyak esensial pilihan, alkohol (vodka atau ethanol), air distilasi, dan botol kaca gelap untuk penyimpanan.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        },
        {
          ArticleId: article2.id,
          topic: 'Langkah-langkah Pembuatan',
          description: 'Campurkan minyak esensial dengan alkohol dalam rasio yang tepat, diamkan selama 48 jam, lalu tambahkan air distilasi. Simpan dalam botol gelap dan biarkan matang selama 2-4 minggu.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        }
      ]);

      console.log('✅ Berhasil menambahkan 2 artikel dengan konten');
    } else {
      console.log('ℹ️ Artikel sudah ada');
    }

    // ----------------- Events -----------------
    console.log('\n=== Memulai proses seeding untuk Event ===');
    const existingEventCount = await Event.count();
    if (existingEventCount === 0) {
      const event1 = await Event.create({
        title: 'Workshop Pembuatan Parfum Natural',
        category: 'Workshop',
        quota: 20,
        location: 'ASK Laboratory, Jakarta',
        fee: 250000,
        description: 'Belajar membuat parfum natural dengan bahan-bahan pilihan. Workshop ini cocok untuk pemula yang ingin memulai bisnis parfum atau sekedar hobi.',
        imageBannerUrl: '/uploads/placeholder-product.jpg',
        startDateTime: new Date('2026-03-15T09:00:00'),
        endDateTime: new Date('2026-03-15T16:00:00'),
        participantRoles: ['Mahasiswa', 'Umum', 'Profesional'],
        status: 'Open'
      });

      await EventContent.bulkCreate([
        {
          EventId: event1.id,
          header: 'Apa yang Akan Dipelajari',
          content: 'Peserta akan belajar tentang dasar-dasar pembuatan parfum, memilih bahan yang tepat, teknik blending, dan cara menyimpan parfum dengan benar.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        },
        {
          EventId: event1.id,
          header: 'Fasilitas',
          content: 'Semua bahan dan alat disediakan, sertifikat, makan siang, dan 1 botol parfum hasil karya sendiri untuk dibawa pulang.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        }
      ]);

      const event2 = await Event.create({
        title: 'Seminar Aromaterapi untuk Kesehatan',
        category: 'Seminar',
        quota: 50,
        location: 'Online via Zoom',
        fee: 0,
        description: 'Seminar gratis tentang manfaat aromaterapi untuk kesehatan fisik dan mental. Dibawakan oleh praktisi aromaterapi bersertifikat.',
        imageBannerUrl: '/uploads/placeholder-product.jpg',
        startDateTime: new Date('2026-03-20T14:00:00'),
        endDateTime: new Date('2026-03-20T16:00:00'),
        participantRoles: ['Mahasiswa', 'Umum'],
        status: 'Open'
      });

      await EventContent.bulkCreate([
        {
          EventId: event2.id,
          header: 'Topik Pembahasan',
          content: 'Manfaat aromaterapi, cara penggunaan yang benar, jenis-jenis minyak esensial, dan aplikasi dalam kehidupan sehari-hari.',
          imageUrls: ['/uploads/placeholder-product.jpg']
        }
      ]);

      console.log('✅ Berhasil menambahkan 2 event dengan konten');
    } else {
      console.log('ℹ️ Event sudah ada');
    }

    // ----------------- Workshops -----------------
    console.log('\n=== Memulai proses seeding untuk Workshop ===');
    const existingWorkshopCount = await Workshop.count();
    if (existingWorkshopCount === 0) {
      await Workshop.bulkCreate([
        {
          title: 'Basic Perfume Making',
          category: 'Beginner',
          description: 'Workshop dasar pembuatan parfum untuk pemula. Pelajari teknik dasar blending dan formulasi parfum natural.',
          imageUrl: '/uploads/placeholder-product.jpg'
        },
        {
          title: 'Advanced Aromatherapy',
          category: 'Advanced',
          description: 'Workshop lanjutan tentang aromaterapi. Pelajari teknik advanced blending dan aplikasi terapeutik minyak esensial.',
          imageUrl: '/uploads/placeholder-product.jpg'
        },
        {
          title: 'Essential Oil Extraction',
          category: 'Professional',
          description: 'Workshop profesional tentang ekstraksi minyak esensial. Pelajari berbagai metode ekstraksi dan quality control.',
          imageUrl: '/uploads/placeholder-product.jpg'
        }
      ]);
      console.log('✅ Berhasil menambahkan 3 workshop');
    } else {
      console.log('ℹ️ Workshop sudah ada');
    }

    // ----------------- Gallery -----------------
    console.log('\n=== Memulai proses seeding untuk Gallery ===');
    const existingGalleryCount = await GalleryImage.count();
    if (existingGalleryCount === 0) {
      await GalleryImage.bulkCreate([
        { title: 'Workshop Parfum 2025', imageUrl: '/uploads/placeholder-product.jpg' },
        { title: 'Laboratorium ASK', imageUrl: '/uploads/placeholder-product.jpg' },
        { title: 'Produk Aromaterapi', imageUrl: '/uploads/placeholder-product.jpg' },
        { title: 'Event Seminar', imageUrl: '/uploads/placeholder-product.jpg' },
        { title: 'Tim ASK Laboratory', imageUrl: '/uploads/placeholder-product.jpg' }
      ]);
      console.log('✅ Berhasil menambahkan 5 gambar gallery');
    } else {
      console.log('ℹ️ Gallery sudah ada');
    }

    console.log('\n🎉 Semua proses seeding selesai tanpa error.');

  } catch (error) {
    console.error('\n❌ Terjadi kesalahan saat seeding:', error);
  } finally {
    await sequelize.close();
    console.log('\nKoneksi ke database sudah ditutup.');
  }
};

// Jalankan fungsi seeding
seed();
