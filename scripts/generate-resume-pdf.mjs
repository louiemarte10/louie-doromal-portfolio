/**
 * Renders /resume to public/louie-doromal-resume.pdf with headless Chrome, so
 * the downloadable file is printed from the same page and the same print
 * stylesheet the visitor sees. Run it after editing src/data/resume.ts:
 *
 *   npm run resume:pdf
 *
 * Needs a local Chrome or Edge. Set CHROME_PATH to point at one explicitly.
 * Vercel has no browser, so the PDF is committed rather than built remotely.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PORT = process.env.PORT ?? "4321";
const URL_TO_PRINT = `http://127.0.0.1:${PORT}/resume`;
const OUT = resolve("public/louie-doromal-resume.pdf");

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findBrowser() {
  const found = CANDIDATES.find((path) => existsSync(path));
  if (!found) {
    throw new Error(
      `No Chrome or Edge found. Set CHROME_PATH to a browser binary.\nLooked in:\n  ${CANDIDATES.join("\n  ")}`,
    );
  }
  return found;
}

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${command} exited with ${code}`)),
    );
  });
}

/** Windows leaves Next's workers behind when the parent alone is killed. */
function stop(child) {
  if (process.platform === "win32") {
    spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(URL_TO_PRINT);
      if (response.ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`${URL_TO_PRINT} never became ready`);
}

const browser = findBrowser();
const nextBin = resolve("node_modules/next/dist/bin/next");
const server = spawn(process.execPath, [nextBin, "start", "-p", PORT], {
  stdio: ["ignore", "ignore", "inherit"],
});

const profile = mkdtempSync(join(tmpdir(), "resume-pdf-"));

try {
  await waitForServer();
  await run(browser, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${OUT}`,
    URL_TO_PRINT,
  ]);
  console.log(`\nWrote ${OUT}`);
} finally {
  stop(server);
  rmSync(profile, { recursive: true, force: true });
}
