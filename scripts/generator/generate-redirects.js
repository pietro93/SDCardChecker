/**
 * SD Card Checker - Redirect Generator
 * Generates redirect rules for migrating from /devices/{slug}/ to /categories/{category}/{slug}/
 */

const path = require("path");
const fs = require("fs");

/**
 * Generate _redirects file (for Netlify)
 */
function generateNetlifyRedirects(allDevices, distPath) {
    let redirectsContent = `# Netlify Redirects - Generated for URL migration
# Redirects old /devices/ URLs to new /categories/ URLs (301 permanent)
# This preserves SEO rankings during URL restructuring

`;

    // Add redirect for each device
    allDevices.forEach((device) => {
        const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        redirectsContent += `/devices/${device.slug}/    /categories/${categorySlug}/${device.slug}/    301\n`;
    });

    // Generic fallback (this won't work for all cases, but helps catch any missed ones)
    redirectsContent += `\n# Fallback for any remaining /devices/ URLs\n/devices/*    /404.html    404\n`;

    fs.writeFileSync(path.join(distPath, "_redirects"), redirectsContent);
    console.log(`  ✓ Generated Netlify _redirects file with ${allDevices.length} device redirects`);
}

/**
 * Generate vercel.json redirect rules (for Vercel)
 * Note: Vercel doesn't support dynamic path params in redirects, so we generate a rules file
 */
function generateVercelConfig(allDevices, distPath) {
    const redirects = allDevices.map((device) => {
        const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        return {
            source: `/devices/${device.slug}`,
            destination: `/categories/${categorySlug}/${device.slug}`,
            permanent: true
        };
    });

    // Also add trailing slash versions
    allDevices.forEach((device) => {
        const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        redirects.push({
            source: `/devices/${device.slug}/`,
            destination: `/categories/${categorySlug}/${device.slug}/`,
            permanent: true
        });
    });

    const vercelConfig = {
        buildCommand: "npm run build:prod",
        outputDirectory: "dist",
        headers: [
            {
                source: "/assets/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable"
                    }
                ]
            }
        ],
        redirects: redirects
    };

    fs.writeFileSync(path.join(distPath, "..", "vercel.json"), JSON.stringify(vercelConfig, null, 2));
    console.log(`  ✓ Generated vercel.json with ${redirects.length} redirect rules`);
}

/**
 * Generate .htaccess file (for Apache servers)
 */
function generateHtaccess(allDevices, distPath) {
    let htaccessContent = `# .htaccess - Apache Redirect Rules
# Redirects old /devices/ URLs to new /categories/ URLs
# This preserves SEO rankings during URL restructuring

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

`;

    // Add redirect for each device
    allDevices.forEach((device) => {
        const categorySlug = device.category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        htaccessContent += `  # Redirect ${device.name}\n`;
        htaccessContent += `  RewriteRule ^devices/${device.slug}/?$ /categories/${categorySlug}/${device.slug}/ [R=301,L]\n`;
    });

    htaccessContent += `
  # Catch any remaining /devices/ URLs
  RewriteRule ^devices/(.*)$ /categories/$1 [R=301,L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options nosniff
  Header set X-Frame-Options SAMEORIGIN
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
`;

    fs.writeFileSync(path.join(distPath, ".htaccess"), htaccessContent);
    console.log(`  ✓ Generated .htaccess with ${allDevices.length} device redirects`);
}

/**
 * Generate all redirect configurations
 */
function generateRedirects(allDevices, distPath) {
    console.log("🔄 Generating URL redirects for SEO migration...");
    generateNetlifyRedirects(allDevices, distPath);
    generateVercelConfig(allDevices, distPath);
    generateHtaccess(allDevices, distPath);
    console.log(`  ✓ All redirect configurations generated successfully`);
}

module.exports = { generateRedirects };
