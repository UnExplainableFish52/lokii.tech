# lokii.tech Project Fix Report

Date: 2026-06-04

## Summary

This pass focused on broken navigation, weak local paths, basic link hygiene, and SEO coverage across the static site. The site now has local-safe internal paths, canonical URLs, social preview metadata, JSON-LD structured data, a visible FAQ section, crawler files, and validation coverage for local links and schema parsing.

## Navigation And Link Fixes

- Fixed broken lesson navigation in:
  - `intro/notes/1.1-what-is-cybersecurity.html`
  - `intro/notes/1.3-landscape.html`
- Changed the broken `href="index.html"` lesson links to `../../index.html#resources`, so "Back to Module Hub" returns to the homepage resource list from nested lesson pages.
- Changed the homepage brand link from `/` to `index.html`, which works better when the site is opened locally instead of only on the hosted domain.
- Added `FAQ` to the homepage top navigation and footer quick links.
- Added the same `FAQ` link to the shared generated navbar in `js/main.js`, so inner pages can route back to `index.html#faq`.
- Normalized root-relative favicon and manifest paths across nested pages to correct relative paths, so local static review does not break asset loading.
- Added `rel="noopener noreferrer"` to external links that open in a new tab.

## Identity Cleanup

- Replaced stale `projects.saksham.bio` footer text with `lokii.tech` in the intro lesson pages where it appeared:
  - `intro/notes/1.1-what-is-cybersecurity.html`
  - `intro/notes/1.2-glossary.html`
  - `intro/notes/1.3-landscape.html`

## SEO And Metadata

- Added canonical URLs to all 26 HTML pages.
- Added `robots` metadata with `index, follow` to all HTML pages.
- Completed or normalized Open Graph metadata across all HTML pages:
  - `og:type`
  - `og:url`
  - `og:title`
  - `og:description`
  - `og:image`
  - `og:site_name`
- Completed Twitter/X card metadata across all HTML pages:
  - `twitter:card`
  - `twitter:url`
  - `twitter:title`
  - `twitter:description`
  - `twitter:image`
- Added a missing description to `matrix.html`.
- Added generated JSON-LD structured data to every HTML page.

## Structured Data Added

- Added `WebSite` and creator identity graph data.
- Added `BreadcrumbList` structured data for page hierarchy.
- Added homepage `WebPage` structured data.
- Added homepage `SiteNavigationElement` structured link data for:
  - About
  - Resources
  - FAQ
  - GitHub
- Added homepage `FAQPage` structured data matching the visible FAQ content.
- Added `TechArticle` and `LearningResource` structured data to lesson, guide, and tool pages.
- Added `WebPage` structured data to `matrix.html`.

## FAQ Section

- Added a visible FAQ section to `index.html` with four practical questions:
  - Who is lokii.tech for?
  - Where should beginners start?
  - Are the resources free?
  - Does the site include project-based learning?
- Added matching FAQ styling in `css/style.css`.
- Added matching FAQ JSON-LD on the homepage.

## Crawler Files

- Added `sitemap.xml` with every HTML page and canonical lokii.tech URLs.
- Added `robots.txt` with:
  - `Allow: /`
  - `Sitemap: https://lokii.tech/sitemap.xml`

## HTML Pages Updated

- `index.html`
- `matrix.html`
- `pro/security-professional-project-guide.html`
- `intermediate/notes/linux_course.html`
- `intermediate/notes/vlan.html`
- `intermediate/notes/networking_interview_prep/networking_study_guide_part_1.html`
- `intermediate/notes/networking_interview_prep/networking_study_guide_part_2.html`
- `intermediate/tools/awk.html`
- `intermediate/tools/cli-trinity-wrapup.html`
- `intermediate/tools/grep.html`
- `intermediate/tools/nmap.html`
- `intermediate/tools/sed.html`
- `intermediate/tools/vim.html`
- `intro/notes/1.1-what-is-cybersecurity.html`
- `intro/notes/1.2-glossary.html`
- `intro/notes/1.3-landscape.html`
- `intro/notes/1.4-intro-to-os.html`
- `intro/notes/1.5_networks.html`
- `intro/notes/1.5_networks/1.5.1_network_fundamentals.html`
- `intro/notes/1.5_networks/1.5.2_osi_tcpip_models.html`
- `intro/notes/1.5_networks/1.5.3_protocols_and_ports.html`
- `intro/notes/1.5_networks/1.5.4_network_devices.html`
- `intro/notes/1.5_networks/1.5.5_wifi_explained.html`
- `intro/notes/1.6_access_control.html`
- `intro/notes/1.7-shell-scripting.html`
- `intro/notes/1.8-shell-scripting-practice.html`

## Validation Completed

- Local `href` and `src` target check: passed.
- Local fragment anchor check: passed.
- Root-relative `href` and `src` check: passed.
- Generated JSON-LD parsing check: passed.
- Canonical URL coverage check: passed.
- `target="_blank"` noopener check: passed.
- `git diff --check`: passed with line-ending warnings only.

## Browser Check Note

The in-app browser blocked both direct `file://` navigation and the temporary localhost static server URL. The temporary server had already exited and port `4173` had no leftover process. Please run the site locally and send screenshots if you want a visual spacing pass on the new FAQ section.
