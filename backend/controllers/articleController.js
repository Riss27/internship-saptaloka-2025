const Article = require("../models/Article");
const ArticleContent = require("../models/ArticleContent");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");

// Helper untuk menghapus file
const deleteFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, "..", "public", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error(`Gagal menghapus file: ${fullPath}`, err);
      });
    }
  }
};

// --- Controller Functions ---
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({ order: [["publishedAt", "DESC"]] });
    res.status(200).json({ status: "success", data: articles });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{ model: ArticleContent, as: "ArticleContents", order: [["id", "ASC"]] }],
    });
    if (!article) {
      return res.status(404).json({ status: "fail", message: "Artikel tidak ditemukan." });
    }
    res.status(200).json({ status: "success", data: article });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  const uploader = upload.fields([{ name: "featuredImage", maxCount: 1 }, { name: "contentImages" }]);

  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });

    try {
      const { title, author, mainDescription, publishedAt } = req.body;
      if (!req.files || !req.files.featuredImage) {
        return res.status(400).json({ status: "fail", message: "Gambar utama wajib diunggah." });
      }
      const featuredImageUrl = `/uploads/${req.files.featuredImage[0].filename}`;

      const newArticle = await Article.create(
        {
          title,
          author,
          mainDescription,
          featuredImageUrl,
          publishedAt,
        },
        { transaction: t }
      );

      const contents = JSON.parse(req.body.contents || "[]");
      const contentImages = req.files.contentImages || [];
      let imageIndex = 0;

      for (const content of contents) {
        // --- LOGIKA BARU UNTUK BANYAK GAMBAR ---
        const imageUrls = []; // Siapkan array untuk menampung URL gambar
        const imageCount = content.imageCount || 0; // Frontend akan mengirim jumlah gambar per section

        for (let i = 0; i < imageCount; i++) {
          if (contentImages[imageIndex]) {
            imageUrls.push(`/uploads/${contentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }

        await ArticleContent.create(
          {
            topic: content.topic,
            description: content.description,
            imageUrls: imageUrls.length > 0 ? imageUrls : null, // Simpan array URL
            ArticleId: newArticle.id,
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(201).json({ status: "success", data: newArticle });
    } catch (error) {
      await t.rollback();
      if (req.files.featuredImage) deleteFile(`/uploads/${req.files.featuredImage[0].filename}`);
      if (req.files.contentImages) {
        req.files.contentImages.forEach((file) => deleteFile(`/uploads/${file.filename}`));
      }
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{ model: ArticleContent, as: "ArticleContents" }],
    });
    if (!article) {
      return res.status(404).json({ status: "fail", message: "Artikel tidak ditemukan." });
    }

    // Hapus semua gambar terkait sebelum menghapus data dari DB
    deleteFile(article.featuredImageUrl);
    if (article.ArticleContents) {
      article.ArticleContents.forEach((content) => {
        deleteFile(content.imageUrl);
      });
    }

    await article.destroy(); // onDelete: 'CASCADE' akan menghapus sub-konten

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  const uploader = upload.fields([{ name: "featuredImage", maxCount: 1 }, { name: "contentImages" }]);

  uploader(req, res, async function (err) {
    const t = await sequelize.transaction();
    if (err) return res.status(400).json({ status: "fail", message: err.message || err });

    try {
      const article = await Article.findByPk(req.params.id, { include: ["ArticleContents"], transaction: t });
      if (!article) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Artikel tidak ditemukan." });
      }

      // 1. Update data utama artikel
      const { title, author, mainDescription, publishedAt } = req.body;
      let featuredImageUrl = article.featuredImageUrl;
      if (req.files.featuredImage) {
        deleteFile(article.featuredImageUrl);
        featuredImageUrl = `/uploads/${req.files.featuredImage[0].filename}`;
      }
      await article.update({ title, author, mainDescription, featuredImageUrl, publishedAt }, { transaction: t });

      // 2. Hapus file gambar dari sub-konten lama yang akan dihapus
      const clientContents = JSON.parse(req.body.contents || "[]");
      const existingUrlsFromClient = new Set(clientContents.flatMap((c) => c.existingImageUrls || []));

      for (const oldContent of article.ArticleContents) {
        if (oldContent.imageUrls) {
          let oldImageUrls = [];
          try {
            oldImageUrls = JSON.parse(oldContent.imageUrls);
          } catch (e) {}

          if (Array.isArray(oldImageUrls)) {
            oldImageUrls.forEach((url) => {
              if (!existingUrlsFromClient.has(url)) {
                deleteFile(url);
              }
            });
          }
        }
      }

      await ArticleContent.destroy({ where: { ArticleId: article.id }, transaction: t });

      // Buat ulang sub-konten berdasarkan data form baru
      const newContentImages = req.files.contentImages || [];
      let imageIndex = 0;

      for (const content of clientContents) {
        const imageUrls = [];
        if (content.existingImageUrls) {
          imageUrls.push(...content.existingImageUrls);
        }
        const newImageCount = content.imageCount || 0;
        for (let i = 0; i < newImageCount; i++) {
          if (newContentImages[imageIndex]) {
            imageUrls.push(`/uploads/${newContentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }

        await ArticleContent.create(
          {
            topic: content.topic,
            description: content.description,
            imageUrls: imageUrls.length > 0 ? imageUrls : null,
            ArticleId: article.id,
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(200).json({ status: "success", data: article });
    } catch (error) {
      await t.rollback();
      if (req.files.featuredImage) deleteFile(`/uploads/${req.files.featuredImage[0].filename}`);
      if (req.files.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
      res.status(500).json({ status: "fail", message: error.message });
    }
  });
};
