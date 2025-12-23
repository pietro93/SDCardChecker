/**
 * Generate Japanese Home Page
 */

const path = require("path");
const { readTemplate, processIncludes, writeFile } = require("./helpers");
const { generateHeader, generateFooter, generateGrowScript } = require("../../src/templates/components-ja");

const srcPath = path.join(__dirname, "../../src");

function generateJapaneseHomePage(distPath) {
  const template = readTemplate(path.join(srcPath, "templates/home-ja.html"));
  
  const header = generateHeader();
  const footer = generateFooter();
  const growScript = generateGrowScript();

  let html = template
    .replace("{{HEADER}}", header)
    .replace("{{FOOTER}}", footer)
    .replace("{{GROW_SCRIPT}}", growScript);

  html = processIncludes(html, srcPath);

  const homePath = path.join(distPath, "ja", "index.html");
  writeFile(homePath, html);
  
  console.log(`  ✓ ${homePath}`);
}

module.exports = { generateJapaneseHomePage };
