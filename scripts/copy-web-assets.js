const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "www");
const outputAssetsDir = path.join(outputDir, "assets");
const androidPublicDir = path.join(projectRoot, "android", "app", "src", "main", "assets", "public");
const androidBuildGradlePath = path.join(projectRoot, "android", "app", "build.gradle");
const generatedVersionInfoPath = path.join(projectRoot, "version-info.js");
const copyToAndroidPublic = process.argv.includes("--android-public");
const filesToCopy = [
  "index.html",
  "future-release.html",
  "app-ads.txt",
  "version.json",
  "version-info.js",
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
  "assets/magnet.png",
  "assets/heart01.png",
  "assets/moneybag-clean.png",
  "assets/teleport01.png",
  "assets/teleport02.png",
  "assets/teleport03.png",
  "assets/rocket01-clean.png",
  "assets/rocket02-clean.png",
  "assets/start screen bkg.png",
  "assets/crossing.png",
  "assets/crossing-foreground.png",
  "assets/gfx2-cloud-rules.png",
  "assets/gfx2-cloud-credits.png",
  "assets/gfx2-cloud-shop.png",
  "assets/hero-question-mark-icon.png"
];
const assetDirectoriesToCopy = [
  "assets/gfx2",
  "assets/ui-sound",
  "assets/skins",
  "assets/Bubble_burst",
  "assets/intro",
  "assets/level1",
  "assets/level2",
  "assets/level3",
  "assets/level4",
  "assets/level5",
  "assets/levelx"
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

function readAndroidVersionInfo() {
  const buildGradleContent = fs.readFileSync(androidBuildGradlePath, "utf8");
  const versionCodeMatch = buildGradleContent.match(/versionCode\s+(\d+)/);
  const versionNameMatch = buildGradleContent.match(/versionName\s+"([^"]+)"/);

  return {
    versionCode: versionCodeMatch ? Number(versionCodeMatch[1]) : 0,
    versionName: versionNameMatch ? versionNameMatch[1] : "0.0.0"
  };
}

function readExistingVersionInfoExtras() {
  if (!fs.existsSync(generatedVersionInfoPath)) {
    return {
      whatsNew: []
    };
  }

  const currentContent = fs.readFileSync(generatedVersionInfoPath, "utf8");
  const whatsNewMatch = currentContent.match(/whatsNew:\s*(\[[\s\S]*?\])/);
  let whatsNew = [];

  if (whatsNewMatch) {
    try {
      whatsNew = JSON.parse(whatsNewMatch[1]);
    } catch (error) {
      whatsNew = [];
    }
  }

  return {
    whatsNew
  };
}

function writeGeneratedVersionInfo() {
  const versionInfo = readAndroidVersionInfo();
  const extras = readExistingVersionInfoExtras();
  const output = [
    "window.HrrraVersionInfo = Object.freeze({",
    "  versionCode: " + versionInfo.versionCode + ",",
    "  versionName: " + JSON.stringify(versionInfo.versionName) + ",",
    "  whatsNew: " + JSON.stringify(extras.whatsNew, null, 2),
    "});",
    ""
  ].join("\n");
  fs.writeFileSync(generatedVersionInfoPath, output, "utf8");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanAssetDirectories(baseDir, logPrefix) {
  for (const dirName of assetDirectoriesToCopy) {
    const relativeDir = path.relative(projectRoot, path.join(projectRoot, dirName));
    const targetDir = path.join(baseDir, relativeDir);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`${logPrefix} cleaned ${relativeDir}`);
    }
  }
}

function copyProjectFiles(baseDir, logPrefix) {
  ensureDir(baseDir);
  ensureDir(path.join(baseDir, "assets"));

  for (const fileName of filesToCopy) {
    const sourcePath = path.join(projectRoot, fileName);
    const targetPath = path.join(baseDir, fileName);
    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`${logPrefix} copied ${fileName}`);
  }

  for (const fileName of allAssetFilesToCopy) {
    const sourcePath = path.join(projectRoot, fileName);
    const targetPath = path.join(baseDir, fileName);
    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`${logPrefix} copied ${fileName}`);
  }
}

ensureDir(outputDir);
ensureDir(outputAssetsDir);
writeGeneratedVersionInfo();
cleanAssetDirectories(outputDir, "web");
copyProjectFiles(outputDir, "web");
console.log(`web assets copied to ${outputDir}`);

if (copyToAndroidPublic) {
  ensureDir(androidPublicDir);
  cleanAssetDirectories(androidPublicDir, "android");
  copyProjectFiles(androidPublicDir, "android");
  console.log(`android public assets mirrored to ${androidPublicDir}`);
}
