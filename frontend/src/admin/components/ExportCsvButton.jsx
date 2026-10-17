import React from "react";
import { Download } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";

// RFC 4180: fields containing a comma, a double quote, or a line break are
// wrapped in quotes; embedded double quotes are doubled.
const escapeCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Synchronous CSV export.
 *
 * Consumers supply Indonesian column headers and a mapRow that turns each
 * row into an array of cell values, so the component stays agnostic of the
 * dataset. The file is written with a UTF-8 BOM so Excel on Windows opens
 * Indonesian diacritics correctly. Toasts belong to the caller — this
 * button only builds and downloads the file.
 */
const ExportCsvButton = ({
  rows,
  filename,
  headers,
  mapRow,
  onExported,
  disabled,
}) => {
  const isEmpty = !rows?.length;

  const handleExport = () => {
    if (isEmpty) return;

    const lines = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => mapRow(row).map(escapeCell).join(",")),
    ];
    const csv = "\uFEFF" + lines.join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    onExported?.();
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || isEmpty}
      className={`inline-flex min-h-11 items-center gap-2 px-4 rounded-buttons-outlined border border-border text-sm font-medium text-cream/90 hover:border-brand-400 hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS_RING}`}
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      Ekspor CSV
    </button>
  );
};

export default ExportCsvButton;
