import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

const root = process.cwd();

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

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
})
  .split("\0")
  .filter(Boolean);

const errors = [];

for (const path of trackedFiles) {
  const name = path.split("/").at(-1) ?? path;

  if (
    path !== ".env.example" &&
    forbiddenNames.some((pattern) => pattern.test(name))
  ) {
    errors.push(`${path}: sensitive file type must not be committed`);
    continue;
  }

  if (!textExtensions.has(extname(name)) && name !== ".gitignore") continue;

  const absolute = resolve(root, path);
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
  console.log(
    `Security audit passed: ${trackedFiles.length} tracked repository files checked for secrets and unsafe source patterns.`,
  );
}
