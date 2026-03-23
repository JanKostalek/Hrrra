const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "www");
const outputAssetsDir = path.join(outputDir, "assets");
const filesToCopy = [
  "index.html",
  "style.css",
  "game.js",
  "config.js",
  "tuning.js",
  "physics.js",
  "world.js",
  "player.js",
  "platform.js",
  "elevator.js"
];
const assetFilesToCopy = [
  "assets/vytah01-clean.png",
  "assets/platform-tile-clean.png",
  "assets/blocker01-clean.png",
  "assets/coin01-clean.png",
  "assets/heart01.png",
  "assets/moneybag-clean.png",
  "assets/teleport01.png",
  "assets/teleport02.png",
  "assets/teleport03.png",
  "assets/rocket01-clean.png",
  "assets/rocket02-clean.png"
];
const assetDirectoriesToCopy = [
  "assets/skins",
  "assets/level1",
  "assets/level2",
  "assets/level3",
  "assets/level4",
  "assets/level5"
];

function collectFilesRecursively(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const out = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFilesRecursively(fullPath));
      continue;
    }
    out.push(path.relative(projectRoot, fullPath));
  }
  return out;
}

const dynamicAssetFilesToCopy = assetDirectoriesToCopy.flatMap((dirName) =>
  collectFilesRecursively(path.join(projectRoot, dirName))
);
const allAssetFilesToCopy = Array.from(new Set(assetFilesToCopy.concat(dynamicAssetFilesToCopy)));

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(outputAssetsDir, { recursive: true });

for (const fileName of filesToCopy) {
  const sourcePath = path.join(projectRoot, fileName);
  const targetPath = path.join(outputDir, fileName);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`copied ${fileName}`);
}

for (const fileName of allAssetFilesToCopy) {
  const sourcePath = path.join(projectRoot, fileName);
  const targetPath = path.join(outputDir, fileName);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`copied ${fileName}`);
}

console.log(`web assets copied to ${outputDir}`);
