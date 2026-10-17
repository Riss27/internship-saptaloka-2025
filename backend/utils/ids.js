// Validasi body { ids: [int] } untuk endpoint bulk (bulk-delete / reorder).
// Return { ids } bila valid, atau { error } berisi pesan Indonesia untuk 400.
const MAX_IDS = 100;

const parseIds = (raw) => {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "Field ids wajib berupa array yang berisi minimal 1 id." };
  }
  if (raw.length > MAX_IDS) {
    return { error: `Maksimal ${MAX_IDS} id dalam satu permintaan.` };
  }
  if (!raw.every((id) => Number.isInteger(id))) {
    return { error: "Semua id harus berupa angka bulat." };
  }
  return { ids: raw };
};

module.exports = { parseIds, MAX_IDS };
