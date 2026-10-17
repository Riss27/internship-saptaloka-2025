const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

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

// --- Kompresi otomatis setelah multer selesai menyimpan file ---

// Sisi terpanjang maksimal 1600px: cukup tajam untuk layar/retina,
// tapi jauh lebih kecil dari foto upload (4000px+).
const MAX_EDGE = 1600;
// Kualitas WebP 80: trade-off ukuran vs kualitas yang umum dipakai,
// nyaris tak terlihat bedanya tapi ukuran jauh lebih kecil dari JPEG/PNG.
const WEBP_QUALITY = 80;

// Hapus file, abaikan "sudah tidak ada" — best-effort, jangan timpa error asli.
async function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") console.error(`[upload] Gagal menghapus ${filePath}:`, err.message);
  }
}

/**
 * Proses satu file hasil multer:
 * 1. Validasi lewat sharp.metadata() — file rusak/bukan gambar asli => hapus + error 400.
 * 2. Bake orientasi EXIF (.rotate()), metadata lain disisihkan sharp secara default.
 * 3. GIF (apa pun) serta WebP/AVIF beranimasi dilewatkan apa adanya agar animasi selamat.
 * 4. Sisanya di-resize maksimal 1600px (fit inside, tanpa perbesaran) -> WebP q80.
 * 5. Jika hasil WebP tidak lebih kecil dari asli, file asli dipertahankan —
 *    upload tidak pernah menghasilkan file yang lebih besar dari sumbernya.
 * 6. Objek file dimutasi di tempat (filename/path/size/mimetype) supaya controller
 *    yang membaca req.file.filename tetap bekerja.
 * Melempar Error berstatus 400 (gambar rusak) atau 500 (gagal memproses);
 * tidak pernah menyisakan file parsial.
 */
async function processUploadedFile(file) {
  if (!file || !file.path) return;

  // Ukuran asli SEBELUM sharp menimpa file.size — dilaporkan lewat uploadInfo.
  file.originalSize = file.size;

  const originalPath = file.path;

  // 1. Gerbang validasi nyata: sharp harus bisa membaca metadata-nya.
  //    Baca ke Buffer dulu: di Windows, sharp berinputkan path bisa menahan
  //    handle file (EBUSY saat unlink), terutama untuk webp — buffer aman.
  let metadata;
  let inputBuffer;
  try {
    inputBuffer = await fs.promises.readFile(originalPath);
    metadata = await sharp(inputBuffer).metadata();
  } catch (err) {
    await safeUnlink(originalPath);
    const error = new Error("File gambar rusak atau bukan gambar valid.");
    error.status = 400;
    throw error;
  }

  const isAnimated = metadata.pages > 1;
  const keepAsIs =
    metadata.format === "gif" ||
    ((metadata.format === "webp" || metadata.format === "avif") && isAnimated);
  if (keepAsIs) return;

  const directory = path.dirname(originalPath);
  const basename = path.basename(originalPath, path.extname(originalPath));
  const tempPath = path.join(directory, basename + ".tmp.webp");
  const finalPath = path.join(directory, basename + ".webp");

  // 2-4. Rotate (orientasi EXIF baked in) -> resize -> WebP q80, tulis ke path sementara.
  let webpStat;
  try {
    await sharp(inputBuffer)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(tempPath);
    webpStat = await fs.promises.stat(tempPath);
  } catch (err) {
    await safeUnlink(tempPath);
    await safeUnlink(originalPath);
    const error = new Error("Gagal memproses gambar.");
    error.status = 500;
    throw error;
  }

  // 5. Simpan hanya kalau hasilnya benar-benar lebih kecil. Tanpa syarat
  //    dimensi di sini: resize sudah diterapkan di atas, jadi kalau WebP
  //    tetap lebih besar (kasus jarang, mis. PNG mulus), asli menang.
  const originalStat = await fs.promises.stat(originalPath);
  if (originalStat.size <= webpStat.size) {
    await safeUnlink(tempPath);
    return;
  }

  // Ganti file: buang asli, rename temp -> nama final .webp (basename tetap sama).
  try {
    await fs.promises.unlink(originalPath);
    await fs.promises.rename(tempPath, finalPath);
  } catch (err) {
    await safeUnlink(tempPath);
    await safeUnlink(finalPath);
    const error = new Error("Gagal memproses gambar.");
    error.status = 500;
    throw error;
  }

  // 6. Mutasi di tempat agar kontrak req.file.filename / req.files.x[0].filename utuh.
  file.filename = path.basename(finalPath);
  file.path = finalPath;
  file.size = webpStat.size;
  file.mimetype = "image/webp";
}

// Kumpulkan semua file hasil upload: req.file (single) dan req.files
// (array langsung dari .array()/.any(), atau objek field dari .fields()).
function collectUploadedFiles(req) {
  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === "object") {
    for (const value of Object.values(req.files)) {
      if (Array.isArray(value)) files.push(...value);
      else if (value) files.push(value);
    }
  }
  return files;
}

// Proses semua file satu request; kalau ada yang gagal, bersihkan SEMUA file
// request itu (termasuk yang sudah sukses) supaya tidak ada file yatim.
async function processRequestFiles(req) {
  const files = collectUploadedFiles(req);
  if (files.length === 0) return;
  try {
    await Promise.all(files.map((file) => processUploadedFile(file)));
  } catch (error) {
    await Promise.all(files.map((file) => safeUnlink(file.path)));
    throw error;
  }
}

// Bungkus middleware multer: setelah multer selesai parse (tanpa error),
// proses file dulu, baru lanjutkan request.
function withPostProcessing(multerMiddleware) {
  return function uploadMiddleware(req, res, next) {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err);
      processRequestFiles(req).then(
        () => next(),
        (error) => next(error)
      );
    });
  };
}

// Permukaan method sama seperti instance multer: single/fields/array/any/none,
// masing-masing sudah di-chain dengan langkah kompresi.
const uploadWithCompression = {
  single: (fieldName) => withPostProcessing(upload.single(fieldName)),
  fields: (fields) => withPostProcessing(upload.fields(fields)),
  array: (fieldName, maxCount) => withPostProcessing(upload.array(fieldName, maxCount)),
  any: () => withPostProcessing(upload.any()),
  none: () => withPostProcessing(upload.none()),
  // Diekspor supaya bisa diuji tanpa HTTP.
  processUploadedFile,
  collectUploadedFiles,
  multerInstance: upload,
};

module.exports = uploadWithCompression;
