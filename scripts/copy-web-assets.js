const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "www");
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

fs.mkdirSync(outputDir, { recursive: true });

for (const fileName of filesToCopy) {
  const sourcePath = path.join(projectRoot, fileName);
  const targetPath = path.join(outputDir, fileName);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`copied ${fileName}`);
}

console.log(`web assets copied to ${outputDir}`);
