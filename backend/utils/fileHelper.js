const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

// Hapus file di dalam folder public/. Nilai publicPath berasal dari database
// (mis. "/uploads/produk-123.png") — divalidasi agar tidak bisa keluar dari
// folder public/ (path traversal).
const deleteFile = (publicPath) => {
  if (!publicPath) return;
  const fullPath = path.resolve(PUBLIC_DIR, publicPath.replace(/^[/\\]+/, ""));
  if (!fullPath.startsWith(PUBLIC_DIR + path.sep)) {
    console.error(`[fileHelper] path ditolak (di luar public/): ${publicPath}`);
    return;
  }
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") console.error(`Gagal menghapus file: ${fullPath}`, err);
  });
};

module.exports = { deleteFile, PUBLIC_DIR };
