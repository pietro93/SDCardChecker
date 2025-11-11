#!/usr/bin/env node

/**
 * Compile Tailwind CSS using PostCSS CLI
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const srcCssPath = path.join(__dirname, "../src/css/tailwind.css");
const distDir = path.join(__dirname, "../dist/assets/css");
const distCssPath = path.join(distDir, "tailwind.css");

try {
  console.log("🎨 Compiling Tailwind CSS...");

  // Ensure output directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Run PostCSS with Tailwind and Autoprefixer
  const cmd = `npx postcss "${srcCssPath}" -o "${distCssPath}" --config tailwind.config.js`;
  
  execSync(cmd, { 
    stdio: "inherit",
    cwd: path.join(__dirname, "..")
  });

  console.log(`  ✓ Compiled to ${distCssPath}`);
} catch (error) {
  console.error("❌ CSS compilation failed:", error.message);
  process.exit(1);
}
