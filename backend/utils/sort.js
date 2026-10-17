// Bangun opsi ORDER Sequelize dari query ?sort=<field>&order=asc|desc.
// Field harus lolos whitelist allowedFields — input user tidak pernah
// di-interpolasi mentah. Mengembalikan defaultOrder bila parameter
// tidak ada/tidak valid, jadi perilaku lama tetap sama tanpa query sort.
const getSort = (query = {}, allowedFields = [], defaultOrder) => {
  const field = typeof query.sort === "string" ? query.sort : "";
  if (!field || !allowedFields.includes(field)) return defaultOrder;

  let dir = typeof query.order === "string" ? query.order.toUpperCase() : "";
  if (dir !== "ASC" && dir !== "DESC") {
    // Default arah: arah field di defaultOrder (jika ada), selain itu ASC.
    const fallback = Array.isArray(defaultOrder)
      ? defaultOrder.find((entry) => Array.isArray(entry) && entry[0] === field)
      : null;
    dir = fallback && typeof fallback[1] === "string" ? fallback[1].toUpperCase() : "ASC";
  }
  if (dir !== "ASC" && dir !== "DESC") dir = "ASC";

  return [[field, dir]];
};

module.exports = { getSort };
