const Article = require("../models/Article");
const ArticleContent = require("../models/ArticleContent");
const upload = require("../middlewares/upload");
const sequelize = require("../config/database");
const { deleteFile } = require("../utils/fileHelper");
const { getPagination } = require("../utils/pagination");
const { searchWhere } = require("../utils/search");
const { getSort } = require("../utils/sort");

// --- Controller Functions ---
exports.getAllArticles = async (req, res) => {
  try {
    const options = {
      order: getSort(req.query, ["publishedAt", "title", "author", "createdAt"], [["publishedAt", "DESC"]]),
    };
    const where = searchWhere(req.query.search, ["title", "mainDescription", "author"]);
    if (where) {
      options.where = where;
    }
    const pagination = getPagination(req.query);
    let data;
    let meta;
    if (pagination) {
      options.limit = pagination.limit;
      options.offset = pagination.offset;
      const { rows, count } = await Article.findAndCountAll(options);
      data = rows;
      meta = { page: pagination.page, limit: pagination.limit, total: count, totalPages: Math.ceil(count / pagination.limit) };
    } else {
      data = await Article.findAll(options);
    }
    res.status(200).json({ status: "success", data, ...(meta && { meta }) });
  } catch (error) {
    console.error("ERROR di getAllArticles:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
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
    console.error("ERROR di getArticleById:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.createArticle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      const { title, author, mainDescription, publishedAt } = req.body;
      if (!req.files || !req.files.featuredImage) {
        await t.rollback();
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

      const contentRows = contents.map((content) => {
        // --- LOGIKA BARU UNTUK BANYAK GAMBAR ---
        const imageUrls = []; // Siapkan array untuk menampung URL gambar
        const imageCount = content.imageCount || 0; // Frontend akan mengirim jumlah gambar per section

        for (let i = 0; i < imageCount; i++) {
          if (contentImages[imageIndex]) {
            imageUrls.push(`/uploads/${contentImages[imageIndex].filename}`);
            imageIndex++;
          }
        }

        return {
          topic: content.topic,
          description: content.description,
          imageUrls: imageUrls.length > 0 ? imageUrls : null, // Simpan array URL
          ArticleId: newArticle.id,
        };
      });

      if (contentRows.length > 0) {
        await ArticleContent.bulkCreate(contentRows, { transaction: t });
      }

      await t.commit();
      res.status(201).json({ status: "success", data: newArticle });
  } catch (error) {
    await t.rollback();
    if (req.files.featuredImage) deleteFile(`/uploads/${req.files.featuredImage[0].filename}`);
    if (req.files.contentImages) {
      req.files.contentImages.forEach((file) => deleteFile(`/uploads/${file.filename}`));
    }
    console.error("ERROR di createArticle:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
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
        if (content.imageUrls) {
          let urls = content.imageUrls;
          if (typeof urls === "string") {
            try { urls = JSON.parse(urls); } catch (e) { urls = []; }
          }
          if (Array.isArray(urls)) {
            urls.forEach((url) => deleteFile(url));
          }
        }
      });
    }

    await article.destroy(); // onDelete: 'CASCADE' akan menghapus sub-konten

    res.status(204).json();
  } catch (error) {
    console.error("ERROR di deleteArticle:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

exports.updateArticle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
      const article = await Article.findByPk(req.params.id, { include: ["ArticleContents"], transaction: t });
      if (!article) {
        await t.rollback();
        return res.status(404).json({ status: "fail", message: "Artikel tidak ditemukan." });
      }

      // 1. Update data utama artikel
      const { title, author, mainDescription, publishedAt } = req.body;
      let featuredImageUrl = article.featuredImageUrl;
      // File lama dihapus hanya SETELAH commit sukses; kalau rollback, file tetap ada
      const filesToDelete = [];
      if (req.files?.featuredImage) {
        filesToDelete.push(article.featuredImageUrl);
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
                filesToDelete.push(url);
              }
            });
          }
        }
      }

      await ArticleContent.destroy({ where: { ArticleId: article.id }, transaction: t });

      // Buat ulang sub-konten berdasarkan data form baru
      const newContentImages = req.files.contentImages || [];
      let imageIndex = 0;

      const contentRows = clientContents.map((content) => {
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

        return {
          topic: content.topic,
          description: content.description,
          imageUrls: imageUrls.length > 0 ? imageUrls : null,
          ArticleId: article.id,
        };
      });

      if (contentRows.length > 0) {
        await ArticleContent.bulkCreate(contentRows, { transaction: t });
      }

      await t.commit();
      filesToDelete.forEach((url) => deleteFile(url));
      res.status(200).json({ status: "success", data: article });
  } catch (error) {
    await t.rollback();
    if (req.files?.featuredImage) deleteFile(`/uploads/${req.files.featuredImage[0].filename}`);
    if (req.files?.contentImages) req.files.contentImages.forEach((f) => deleteFile(`/uploads/${f.filename}`));
    console.error("ERROR di updateArticle:", error);
    res.status(500).json({ status: "fail", message: "Terjadi kesalahan pada server." });
  }
};
