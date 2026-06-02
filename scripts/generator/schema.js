const SITE_URL = "https://sdcardchecker.com";
const SITE_NAME = "SD Card Checker";
const CONTACT_EMAIL = "contact@sdcardchecker.com";

function buildGlobalSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/img/brand/logo.webp`,
        },
        foundingDate: "2025-12-31",
        vatID: "IT03173170808",
        taxID: "IT03173170808",
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "customer support",
        },
        founder: { "@id": `${SITE_URL}/#founder` },
        sameAs: ["https://github.com/pietro93/SDCardChecker"],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: "Pietro Romeo",
        url: SITE_URL,
        sameAs: [
          "https://pietroromeo.medium.com/",
          "https://scholar.google.com/citations?user=16VCt3EAAAAJ",
          "https://www.semanticscholar.org/author/Pietro-Romeo/2062621259",
          "https://dl.acm.org/profile/99659019466",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function buildAboutPageSchema(pathname = "/about.html") {
  const isJapanese = pathname.startsWith("/ja/");
  const url = `${SITE_URL}${pathname}`;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#about-page`,
    url,
    name: isJapanese ? `${SITE_NAME}について` : `About ${SITE_NAME}`,
    description: isJapanese
      ? "SD Card Checkerについて学びましょう。あらゆるデバイスに最適なSDカードを見つけるための信頼できるリソースです。"
      : "Learn about SD Card Checker, your trusted resource for finding the perfect SD card for any device.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };
}

function jsonLdScript(schemaObject) {
  return `<script type="application/ld+json">${JSON.stringify(schemaObject)}</script>`;
}

function removeLegacyAboutOrganizationSchema(content) {
  return content.replace(
    /\s*<!-- Schema\.org Markup -->\s*<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"Organization",[\s\S]*?\}\s*<\/script>\s*/m,
    "\n"
  );
}

function normalizeOrganizationReferences(content) {
  const organizationRef = `{ "@id": "${SITE_URL}/#organization" }`;

  return content.replace(
    /"(author|publisher)"\s*:\s*\{\s*"@type"\s*:\s*"Organization"\s*,\s*"name"\s*:\s*"SD Card Checker"\s*(?:,\s*"logo"\s*:\s*"[^"]*")?\s*\}/g,
    (_, property) => `"${property}": ${organizationRef}`
  );
}

function publicPathFromFile(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  const distIndex = normalized.lastIndexOf("/dist/");

  if (distIndex === -1) {
    return "";
  }

  return `/${normalized.slice(distIndex + "/dist/".length)}`;
}

function injectSchema(content, filePath) {
  if (typeof content !== "string" || !filePath.endsWith(".html") || !/<\/head>/i.test(content)) {
    return content;
  }

  let html = content;
  const publicPath = publicPathFromFile(filePath);

  if (publicPath === "/about.html" || publicPath === "/ja/about.html") {
    html = removeLegacyAboutOrganizationSchema(html);
  }

  html = normalizeOrganizationReferences(html);

  const schemaBlocks = [];

  if (!html.includes(`${SITE_URL}/#founder`) || !html.includes("Pietro Romeo")) {
    schemaBlocks.push(jsonLdScript(buildGlobalSchema()));
  }

  if (
    (publicPath === "/about.html" || publicPath === "/ja/about.html") &&
    !html.includes("#about-page")
  ) {
    schemaBlocks.push(jsonLdScript(buildAboutPageSchema(publicPath)));
  }

  if (schemaBlocks.length === 0) {
    return html;
  }

  return html.replace(/<\/head>/i, `${schemaBlocks.map((block) => `  ${block}`).join("\n")}\n</head>`);
}

module.exports = {
  SITE_URL,
  SITE_NAME,
  buildGlobalSchema,
  buildAboutPageSchema,
  injectSchema,
};
