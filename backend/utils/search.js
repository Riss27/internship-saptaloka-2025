const { Op } = require("sequelize");

// Bangun kondisi "SEARCH" (LIKE %..%) untuk beberapa kolom sekaligus.
// Mengembalikan null bila query kosong, jadi aman di-merge:
//   options.where = { ...(category && { category }), ...searchWhere(search, ["name"]) };
// Wildcard user (\, %, _) di-escape supaya tidak dianggap pola.
const searchWhere = (query, fields) => {
  const term = typeof query === "string" ? query.trim() : "";
  if (!term) return null;

  const escaped = term.replace(/[\\%_]/g, (char) => `\\${char}`);
  return {
    [Op.or]: fields.map((field) => ({ [field]: { [Op.like]: `%${escaped}%` } })),
  };
};

module.exports = { searchWhere };
