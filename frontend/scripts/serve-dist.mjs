// Local production preview that serves dist/ with gzip, which `vite preview`
// does not do. Node stdlib only, no dependencies.
//
// Two reasons this exists beyond compression: the VS Code Console Ninja
// extension injects a large inline script into every response Vite produces,
// ahead of <meta charset>, which is what a Lighthouse run reports as a late
// charset and a render-blocking script. This server is not Vite, so responses
// stay exactly what is on disk. Second, gzip is applied here so text assets
// can be measured the way a real host would serve them.
//
// Run: node scripts/serve-dist.mjs [port]   (default 4174)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { gzip } from "node:zlib";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const gzipAsync = promisify(gzip);
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.argv[2]) || 4174;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

// Text types worth compressing; binaries are skipped.
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".txt", ".svg", ".map"]);

// Resolve the request path inside dist only. Anything missing falls back to
// index.html so client-side routes deep-link correctly, same as vite preview.
async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = path.normalize(path.join(distDir, clean));
  if (!candidate.startsWith(distDir)) return path.join(distDir, "index.html");
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) return path.join(candidate, "index.html");
    return candidate;
  } catch {
    return path.join(distDir, "index.html");
  }
}

const server = createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url || "/");
    const ext = path.extname(file);
    let body;
    try {
      body = await readFile(file);
    } catch {
      body = await readFile(path.join(distDir, "index.html"));
    }

    const headers = {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      // Hashed build assets are content-addressed, so they can be cached hard.
      // Fonts keep stable names, so a week is the safe ceiling; the HTML shell
      // must always be revalidated or old bundles get pinned.
      "Cache-Control": file.includes(`${path.sep}assets${path.sep}`)
        ? "public, max-age=31536000, immutable"
        : file.includes(`${path.sep}fonts${path.sep}`)
          ? "public, max-age=604800"
          : "no-cache",
    };

    const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
    if (acceptsGzip && COMPRESSIBLE.has(ext) && body.length > 1024) {
      body = await gzipAsync(body);
      headers["Content-Encoding"] = "gzip";
      headers.Vary = "Accept-Encoding";
    }

    headers["Content-Length"] = body.length;
    res.writeHead(200, headers);
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(err));
  }
});

server.listen(port, () => {
  console.log(`dist preview: http://localhost:${port}/`);
});
