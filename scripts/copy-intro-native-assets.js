const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceIntroDir = path.join(projectRoot, "assets", "intro");
const androidDrawableDir = path.join(projectRoot, "android", "app", "src", "main", "res", "drawable");
const androidRawDir = path.join(projectRoot, "android", "app", "src", "main", "res", "raw");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFileIfExists(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    return false;
  }
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
  return true;
}

ensureDir(androidDrawableDir);
ensureDir(androidRawDir);

const imageCopied = copyFileIfExists(
  path.join(sourceIntroDir, "hrrra-splash.jpg"),
  path.join(androidDrawableDir, "hrrra_splash.jpg")
);

const videoCopied = copyFileIfExists(
  path.join(sourceIntroDir, "intro_video.mp4"),
  path.join(androidRawDir, "intro_video.mp4")
);

if (imageCopied) {
  console.log("android intro drawable copied to res/drawable/hrrra_splash.jpg");
}
if (videoCopied) {
  console.log("android intro video copied to res/raw/intro_video.mp4");
}
