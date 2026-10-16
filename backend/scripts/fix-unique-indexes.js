// One-off cleanup: drop the duplicate unique indexes that sync({ alter: true })
// accumulated on Users and Categories (one per boot, from the unnamed
// field-level `unique: true`). The models now declare explicitly named unique
// indexes; the next sync creates exactly those and then stays idempotent.
// Run: node scripts/fix-unique-indexes.js
require("dotenv").config();
const sequelize = require("../config/database");

const CLEANUPS = [
  { table: "users", keep: [], pattern: /^email(_\d+)?$/ },
  { table: "categories", keep: [], pattern: /^name(_\d+)?$/ },
];

(async () => {
  try {
    for (const { table, pattern } of CLEANUPS) {
      const [rows] = await sequelize.query(`SHOW INDEX FROM \`${table}\``);
      const keys = [...new Set(rows.map((r) => r.Key_name))].filter((n) =>
        pattern.test(n),
      );
      for (const key of keys) {
        await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${key}\``);
      }
      const [after] = await sequelize.query(`SHOW INDEX FROM \`${table}\``);
      console.log(
        `${table}: dropped ${keys.length} (${keys.join(", ") || "none"}) -> now ${[
          ...new Set(after.map((r) => r.Key_name)),
        ].join(", ")}`,
      );
    }
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
