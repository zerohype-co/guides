'use strict';
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync('pages-config.json', 'utf8'));
const template = fs.readFileSync('_template.html', 'utf8');
const BASE_URL = 'https://zerohypelab.com/guides/';

let count = 0;
for (const page of config.pages) {
  let html = template;
  html = html.split('{{SLUG}}').join(page.slug);
  html = html.split('{{PAGE_TITLE}}').join(page.title);
  html = html.split('{{META_TITLE}}').join(page.metaTitle);
  html = html.split('{{META_DESCRIPTION}}').join(page.metaDescription);
  html = html.split('{{CANONICAL_URL}}').join(BASE_URL + page.slug + '/');
  html = html.split('{{PAGE_CONTENT}}').join(page.content);
  html = html.split('{{CTA_HEADLINE}}').join(page.ctaHeadline);
  html = html.split('{{CTA_DESCRIPTION}}').join(page.ctaDescription);
  html = html.split('{{CTA_BUTTON_TEXT}}').join(page.ctaButtonText);
  html = html.split('{{CTA_BUTTON_URL}}').join(page.ctaButtonUrl);
  html = html.split('{{CLUSTER_NAME}}').join(page.clusterName);
  html = html.split('{{CLUSTER_SLUG}}').join(page.cluster);

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": page.metaDescription,
    "url": BASE_URL + page.slug + '/',
    "publisher": {
      "@type": "Organization",
      "name": "ZeroHype",
      "url": "https://zerohypelab.com"
    }
  });
  html = html.split('{{SCHEMA_JSON}}').join(schema);

  const dir = page.slug;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  count++;
}
console.log('Generated ' + count + ' pages.');
