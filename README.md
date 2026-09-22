# Stylos production site

This folder is a deployment-ready static website. Serve its root over HTTPS so that `index.html`, `robots.txt`, `sitemap.xml`, and `llms.txt` are available at the site root.

## Structure

- `index.html` contains semantic markup, metadata, and static JSON-LD.
- `css/styles.css` contains the complete visual system.
- `js/` separates critical theme setup, Firebase reading, geometry, rendering, and application behaviour.
- `assets/` contains the local project screenshots and favicon.
- `SECURITY-AUDIT.md` records resolved and deployment-level security work.
- `QA-REPORT.md` records source-preservation and browser-verification results.

## Deployment checks

1. Publish the folder at `https://stylos.co/` with HTTPS enabled.
2. Configure the response headers listed in `SECURITY-AUDIT.md`.
3. Confirm the Firebase API-key allowlist, App Check, Authentication users, and Firestore rules.
4. Submit `https://stylos.co/sitemap.xml` in Google Search Console and inspect the rendered URL.
5. Test the deployed page in Google Rich Results Test and PageSpeed Insights.
6. Confirm that the production host does not block Googlebot or OAI-SearchBot.
