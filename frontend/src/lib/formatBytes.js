/**
 * Human-readable file size.
 *
 * Base-1024 steps through B/KB/MB/GB. Values of one unit or more are shown
 * as whole numbers (36 KB reads better than 36,00 KB in a file list);
 * anything smaller keeps two decimals. Locale is Indonesian, so the decimal
 * comma comes for free.
 */
export default function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const options =
    value >= 1
      ? { maximumFractionDigits: 0 }
      : { maximumFractionDigits: 2 };

  return `${value.toLocaleString("id-ID", options)} ${units[unitIndex]}`;
}
