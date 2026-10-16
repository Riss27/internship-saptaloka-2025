// One-off data fix: align Article.publishedAt with the event date written in
// each article body. The admin form saved the row-import instant for every
// article (2 Oktober 2025), so the public pages showed a date that
// contradicted the text. Bypasses the authenticated HTTP route on purpose -
// this runs on the server, next to the models. Run: node scripts/fix-article-dates.js
require("dotenv").config();
const sequelize = require("../config/database");
const Article = require("../models/Article");

// Explicit +07:00 so the stored UTC instant renders as the intended calendar
// day in WIB.
const fixes = [
  { id: 2, when: "2024-12-21T00:00:00+07:00" }, // STEM CAMP, 21 Desember 2024
  { id: 4, when: "2024-06-07T00:00:00+07:00" }, // Workshop mahasiswa, 7 Juni 2024
];

(async () => {
  try {
    for (const { id, when } of fixes) {
      const [count] = await Article.update(
        { publishedAt: new Date(when) },
        { where: { id } },
      );
      const row = await Article.findByPk(id);
      console.log(`id ${id}: ${count} row(s), publishedAt=${row.publishedAt.toISOString()}`);
    }
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
