const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { protect, requireAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { createArticleRules, updateArticleRules, validate } = require("../middlewares/validators/articleValidator.js");

const articleUpload = upload.fields([{ name: "featuredImage", maxCount: 1 }, { name: "contentImages" }]);

router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);

router.post("/", protect, requireAdmin, articleUpload, createArticleRules(), validate, articleController.createArticle);
router.put("/:id", protect, requireAdmin, articleUpload, updateArticleRules(), validate, articleController.updateArticle);
router.delete("/:id", protect, requireAdmin, articleController.deleteArticle);

module.exports = router;
