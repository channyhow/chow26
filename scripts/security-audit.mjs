import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".netlify",
  ".vercel",
  "coverage",
  "dist",
  "node_modules",
  "project_sources",
  "upload",
]);

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".scss",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const forbiddenNames = [
  /^\.env(?:\..+)?$/,
  /\.(?:cer|crt|key|mobileprovision|p12|pem|pfx)$/i,
];

const secretPatterns = [
  ["private key", /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
  ["GitHub token", /\bgh[opsu]_[A-Za-z0-9_]{36,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Stripe secret key", /\bsk_(?:live|test)_[0-9A-Za-z]{20,}\b/],
  ["generic assigned secret", /\b(?:api[_-]?key|client[_-]?secret|password|private[_-]?key|secret|token)\b\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];

const unsafeSourcePatterns = [
  ["dangerouslySetInnerHTML", /\bdangerouslySetInnerHTML\b/],
  ["eval", /\beval\s*\(/],
  ["Function constructor", /\bnew\s+Function\s*\(/],
  ["document.write", /\bdocument\.write\s*\(/],
];

const files = [];
const visit = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(absolute);
    } else if (entry.isFile()) {
      files.push(absolute);
    }
  }
};

await visit(root);

const errors = [];
for (const absolute of files) {
  const path = relative(root, absolute).replaceAll("\\", "/");
  const name = path.split("/").at(-1) ?? path;

  if (
    path !== ".env.example" &&
    forbiddenNames.some((pattern) => pattern.test(name))
  ) {
    errors.push(`${path}: sensitive file type must not be committed`);
    continue;
  }

  if (!textExtensions.has(extname(name)) && name !== ".gitignore") continue;
  if ((await stat(absolute)).size > 1_000_000) continue;

  const source = await readFile(absolute, "utf8");
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(source)) errors.push(`${path}: possible ${label}`);
  }

  if (
    /^(?:src|scripts)\//.test(path) &&
    path !== "scripts/security-audit.mjs"
  ) {
    for (const [label, pattern] of unsafeSourcePatterns) {
      if (pattern.test(source)) errors.push(`${path}: unsafe ${label} usage`);
    }
  }
}

if (errors.length) {
  console.error("\nSecurity audit failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Security audit passed: ${files.length} repository files checked for secrets and unsafe source patterns.`);
}
