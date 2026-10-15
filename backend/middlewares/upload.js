const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter untuk hanya menerima file gambar (cocokkan persis, bukan regex lepas)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png", ".gif", ".webp"];

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(extname)) {
    return cb(null, true);
  }
  const error = new Error("Hanya file gambar (jpeg, jpg, png, gif, webp) yang diizinkan!");
  error.status = 400;
  cb(error);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 20 },
  fileFilter: fileFilter,
});

module.exports = upload;
