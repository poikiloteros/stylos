# Stylos production site

This folder is a deployment-ready static website. Serve its root over HTTPS so that `index.html`, `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, and `llms.txt` are available at the site root.

Revision 16 (2026-09-23). What changed from `../refactored/`, and why, is in `CHANGES.md`.

## Structure

- `index.html` contains semantic markup, metadata, and static JSON-LD.
- `css/styles.css` contains the complete visual system.
- `js/` separates critical theme setup, Firebase reading, geometry, rendering, and application behaviour.
- `assets/images/` contains the local project screenshots.
- `assets/icons/` contains the favicon set: `favicon.svg`, `apple-touch-icon.png` (180, full bleed), `icon-192.png` and `icon-512.png` for the manifest. `favicon.ico` (16/32/48) sits at the root.
- `CHANGES.md` records revision 16 and the reasoning behind each value.
- `SECURITY-AUDIT.md` records resolved and deployment-level security work.
- `QA-REPORT.md` records source-preservation and browser-verification results for the refactor itself (22 September).

## Deployment checks

1. Publish the folder at `https://stylos.co/` with HTTPS enabled.
2. Configure the response headers listed in `SECURITY-AUDIT.md`.
3. Confirm the Firebase API-key allowlist, App Check, Authentication users, and Firestore rules.
4. Submit `https://stylos.co/sitemap.xml` in Google Search Console and inspect the rendered URL.
5. Test the deployed page in Google Rich Results Test and PageSpeed Insights.
6. Confirm that the production host does not block Googlebot or OAI-SearchBot.
