import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const WORKTREE_DIR = ".publish";
const BUILD_DIR = "dist";
const TARGET_BRANCH = "publish";
const SOURCE_BRANCH = "main";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function runSilent(cmd) {
  return execSync(cmd).toString().trim();
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    if (entry === ".git") continue;
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) copyRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function ensureWorktree() {
  if (!fs.existsSync(WORKTREE_DIR)) {
    console.log(`Worktree '${WORKTREE_DIR}' missing, adding...`);
    run(`git worktree add ${WORKTREE_DIR} ${TARGET_BRANCH}`);
  }
}

async function main() {
  try {
    console.log(`Current branch: ${SOURCE_BRANCH}`);
    const branch = runSilent("git rev-parse --abbrev-ref HEAD");
    if (branch !== SOURCE_BRANCH) {
      console.error(`Error: Must be on '${SOURCE_BRANCH}' branch`);
      process.exit(1);
    }

    console.log("Fetching remote...");
    run("git fetch origin");

    const diff = runSilent("git status --porcelain");
    if (diff.length > 0) {
      console.error("Working tree not clean. Commit or stash first.");
      process.exit(1);
    }

    console.log("Installing dependencies...");
    if (fs.existsSync("package-lock.json")) run("npm ci");
    else run("npm install");

    console.log("Building...");
    run("npm run build");

    if (!fs.existsSync(BUILD_DIR)) {
      console.error(`Build failed: '${BUILD_DIR}' missing`);
      process.exit(1);
    }

    ensureWorktree();

    console.log(`Cleaning ${WORKTREE_DIR}...`);
    emptyDir(WORKTREE_DIR);

    console.log(`Copying ${BUILD_DIR} → ${WORKTREE_DIR}...`);
    copyRecursive(BUILD_DIR, WORKTREE_DIR);

    console.log("Committing & pushing...");
    run(`git -C ${WORKTREE_DIR} add .`);
    run(`git -C ${WORKTREE_DIR} commit -m "Auto deploy" || echo "No changes to commit"`);
    run(`git -C ${WORKTREE_DIR} push origin ${TARGET_BRANCH}`);

    console.log("✅ Deployment complete!");
  } catch (err) {
    console.error("\n❌ Deployment failed!");
    console.error(err);
    process.exit(1);
  }
}

main();
