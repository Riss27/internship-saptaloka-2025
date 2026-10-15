// Baca query pagination. Return null jika ?page tidak diminta (perilaku lama dipertahankan).
const getPagination = (query, defaultLimit = 12) => {
  const page = parseInt(query.page, 10);
  if (!page || page < 1) return null;
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, offset: (page - 1) * limit };
};

module.exports = { getPagination };
