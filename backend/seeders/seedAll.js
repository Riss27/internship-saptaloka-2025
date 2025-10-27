require('dotenv').config();

const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');
const LabTool = require('../models/LabTool');
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
  const itemsToAdd = 20; // jumlah data dummy per tabel

  try {
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
