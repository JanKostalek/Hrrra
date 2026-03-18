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
  "assets/gamebackground_foreground_tile.png",
  "assets/gamebackground_sky_tile.png",
  "assets/vytah01-clean.png",
  "assets/platform-tile-clean.png",
  "assets/blocker01-clean.png",
  "assets/coin01-clean.png",
  "assets/heart01.png",
  "assets/hero-jump-01.png",
  "assets/hero-jump-02.png",
  "assets/hero-jump-03.png",
  "assets/hero-jump-04.png",
  "assets/hero-jump-05.png",
  "assets/hero-jump-06.png",
  "assets/hero-jump-07.png",
  "assets/hero-jump-08.png",
  "assets/hero-jump-09.png",
  "assets/hero-walk-01.png",
  "assets/hero-walk-02.png",
  "assets/hero-walk-03.png",
  "assets/hero-walk-04.png",
  "assets/hero-walk-05.png",
  "assets/hero-walk-06.png",
  "assets/moneybag-clean.png",
  "assets/teleport01.png",
  "assets/teleport02.png",
  "assets/teleport03.png",
  "assets/rocket01-clean.png",
  "assets/rocket02-clean.png"
];

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(outputAssetsDir, { recursive: true });

for (const fileName of filesToCopy) {
  const sourcePath = path.join(projectRoot, fileName);
  const targetPath = path.join(outputDir, fileName);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`copied ${fileName}`);
}

for (const fileName of assetFilesToCopy) {
  const sourcePath = path.join(projectRoot, fileName);
  const targetPath = path.join(outputDir, fileName);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`copied ${fileName}`);
}

console.log(`web assets copied to ${outputDir}`);
