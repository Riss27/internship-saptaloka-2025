// One-off migration: tambah kolom sortOrder ke landingpages & galleryimages,
// lalu backfill agar urutan publik SEBELUM kolom ini ada tetap identik:
//   - LandingPage  : urutan lama id ASC  -> sortOrder 1..n
//   - GalleryImage : urutan lama id DESC -> sortOrder 1..n
//
// PENTING — JALANKAN SEKALI SAAT DEPLOY. Skrip ini MERERESET urutan manual
// admin: semua baris diisi ulang sortOrder = 1..n sesuai urutan id di atas.
// Menjalankannya lagi akan menimpa kembali urutan manual yang sudah diatur
// lewat PATCH /api/landing-page/order atau PATCH /api/gallery/order.
//
// Run: node scripts/add-sort-order.js
require("dotenv").config();
const sequelize = require("../config/database");

const TABLES = [
  { table: "landingpages", idOrder: "ASC" },
  { table: "galleryimages", idOrder: "DESC" },
];

(async () => {
  try {
    for (const { table, idOrder } of TABLES) {
      // (a) Tambah kolom; abaikan kalau sudah ada (ER_DUP_FIELD).
      try {
        await sequelize.query(
          `ALTER TABLE \`${table}\` ADD COLUMN \`sortOrder\` INT NOT NULL DEFAULT 0`,
        );
      } catch (err) {
        // mysql2 melaporkan ER_DUP_FIELDNAME (errno 1060) untuk kolom ganda;
        // pada SequelizeDatabaseError kode ada di parent, bukan di atas.
        const code = err.code || (err.parent && err.parent.code);
        if (code !== "ER_DUP_FIELD" && code !== "ER_DUP_FIELDNAME") throw err;
        console.log(`${table}: kolom sortOrder sudah ada, ALTER dilewati.`);
      }

      // (b) Backfill: semua baris diurutkan id ${idOrder}, diberi sortOrder 1..n.
      const [rows] = await sequelize.query(
        `SELECT \`id\` FROM \`${table}\` ORDER BY \`id\` ${idOrder}`,
      );
      for (const [index, row] of rows.entries()) {
        await sequelize.query(
          `UPDATE \`${table}\` SET \`sortOrder\` = ? WHERE \`id\` = ?`,
          { replacements: [index + 1, row.id] },
        );
      }
      console.log(`${table}: backfill sortOrder 1..${rows.length} (urutan id ${idOrder}).`);
    }
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
