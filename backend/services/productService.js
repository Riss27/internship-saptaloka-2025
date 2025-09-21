const Product = require("../models/Product");

const getAllProducts = async (query) => {
  const filterOptions = {};
  if (query.category) {
    filterOptions.where = { category: query.category };
  }
  return await Product.findAll(filterOptions);
};

const getProductById = async (id) => {
  return await Product.findByPk(id);
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const updateProduct = async (id, productData) => {
  const product = await Product.findByPk(id);
  if (!product) {
    return null;
  }
  await product.update(productData);
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    return 0; // Mengindikasikan tidak ada baris yang dihapus
  }
  await product.destroy();
  return 1; // Mengindikasikan 1 baris berhasil dihapus
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
