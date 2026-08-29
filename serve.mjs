/**
 * Servidor estático — pasta nataleluia-lp.
 * node serve.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let port = Number(process.env.PORT) || 8770;
const PORT_MAX = 8810;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const rel = decoded === "/" ? "index.html" : decoded.replace(/^\//, "");
  const full = path.normalize(path.join(__dirname, rel));
  if (!full.startsWith(__dirname)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const target = safeResolve(req.url || "/");
  if (!target) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(target, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(target).toLowerCase();
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    res.end(data);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && port < PORT_MAX) {
    port += 1;
    server.listen(port, "127.0.0.1");
    return;
  }
  console.error(err);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Nataleluia LP → http://127.0.0.1:${port}/`);
});
