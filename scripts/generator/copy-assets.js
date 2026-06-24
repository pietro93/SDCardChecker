/**
 * SD Card Checker - Copy Assets Module
 */

const path = require("path");
const fs = require("fs");
const { copyDir, ensureDir } = require("./helpers");

const srcPath = path.join(__dirname, "../../src");
const publicPath = path.join(__dirname, "../../public");
const distPath = path.join(__dirname, "../../dist");

async function copyAssets() {
  console.log("Copying assets...");

  const cssPath = path.join(srcPath, "css");
  const jsPath = path.join(srcPath, "js");

  // Copy CSS files
  if (fs.existsSync(cssPath)) {
    copyDir(cssPath, path.join(distPath, "assets", "css"));
    console.log(`✓ Copied CSS files`);
    
    // Check if tailwind.css was compiled
    const tailwindCss = path.join(cssPath, "tailwind.css");
    if (!fs.existsSync(tailwindCss)) {
      console.warn(`tailwind.css not found. Run 'npm run build:css' first`);
    }
  } else {
    console.warn(`CSS directory not found at ${cssPath}`);
  }

  // Copy JS files
  if (fs.existsSync(jsPath)) {
    copyDir(jsPath, path.join(distPath, "assets", "js"));
    console.log(`✓ Copied JS files`);
  }

  // Copy devices.json for client-side search
   const deviceJsonSrc = path.join(srcPath, "../data/devices.json");
   const deviceJsonDest = path.join(distPath, "data/devices.json");
   ensureDir(path.dirname(deviceJsonDest));
   fs.copyFileSync(deviceJsonSrc, deviceJsonDest);
   console.log(`✓ data/devices.json`);

   // Copy sdcards.json for calculator widget
    const sdcardsJsonSrc = path.join(srcPath, "../data/sdcards.json");
    const sdcardsJsonDest = path.join(distPath, "data/sdcards.json");
    if (fs.existsSync(sdcardsJsonSrc)) {
      fs.copyFileSync(sdcardsJsonSrc, sdcardsJsonDest);
      console.log(`✓ data/sdcards.json`);
    } else {
      console.warn(`sdcards.json not found at ${sdcardsJsonSrc}`);
    }

    // Copy Amazon cache directory for product badges
    const amazonCacheSrc = path.join(srcPath, "../data/amazon-cache");
    const amazonCacheDest = path.join(distPath, "data/amazon-cache");
    if (fs.existsSync(amazonCacheSrc)) {
      copyDir(amazonCacheSrc, amazonCacheDest);
      console.log(`✓ Copied amazon-cache`);
    }

   // Copy images folder
   const imgPath = path.join(srcPath, "../img");
   if (fs.existsSync(imgPath)) {
     copyDir(imgPath, path.join(distPath, "img"));
     console.log(`✓ Copied img folder`);
   }

   // Copy root-level public files such as ads.txt into the deploy output.
   if (fs.existsSync(publicPath)) {
     copyDir(publicPath, distPath);
     console.log(`Copied public files`);
   }
   }

module.exports = { copyAssets };
