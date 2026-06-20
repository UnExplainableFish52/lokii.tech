<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm">

  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>lokii.tech Sitemap</title>
        <meta name="robots" content="noindex, follow"/>
        <link rel="icon" href="favicon.ico"/>
        <style>
          :root {
            --bg: #060708;
            --panel: #0d1117;
            --panel-soft: #111821;
            --border: #28313a;
            --border-strong: #3a4652;
            --text: #f4f7fa;
            --muted: #9da9b5;
            --soft: #cbd6e2;
            --blue: #8bc5ff;
            --green: #42d39b;
            --gold: #f4b860;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            background:
              radial-gradient(circle at top left, rgba(91, 167, 247, 0.16), transparent 30rem),
              radial-gradient(circle at top right, rgba(66, 211, 155, 0.12), transparent 28rem),
              linear-gradient(180deg, #071014 0%, var(--bg) 48%, #080709 100%);
            color: var(--text);
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          a:hover {
            color: var(--blue);
          }

          .wrap {
            width: min(1120px, calc(100% - 2rem));
            margin: 0 auto;
          }

          .topbar {
            border-bottom: 1px solid rgba(184, 194, 204, 0.12);
            background: rgba(6, 7, 8, 0.86);
            backdrop-filter: blur(16px);
          }

          .topbar-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            min-height: 64px;
          }

          .brand {
            display: inline-flex;
            align-items: center;
            gap: 0.65rem;
            color: var(--text);
            font-size: 1.15rem;
            font-weight: 800;
          }

          .brand img {
            width: 34px;
            height: 34px;
            border: 1px solid rgba(139, 197, 255, 0.22);
            border-radius: 8px;
          }

          .nav {
            display: flex;
            align-items: center;
            gap: 0.45rem;
          }

          .nav a {
            border-radius: 8px;
            color: var(--soft);
            font-size: 0.92rem;
            font-weight: 750;
            padding: 0.45rem 0.65rem;
          }

          .nav a:hover {
            background: rgba(91, 167, 247, 0.1);
            text-decoration: none;
          }

          .hero {
            padding: clamp(2rem, 6vw, 4rem) 0 1.4rem;
          }

          .kicker {
            color: var(--green);
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 0;
            margin: 0 0 0.5rem;
            text-transform: uppercase;
          }

          h1 {
            max-width: 820px;
            margin: 0;
            color: var(--text);
            font-size: clamp(2.1rem, 6vw, 4rem);
            line-height: 1.05;
            letter-spacing: 0;
          }

          .summary {
            max-width: 760px;
            margin: 1rem 0 0;
            color: var(--soft);
            font-size: 1.05rem;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.75rem;
            margin: 1.25rem 0 0;
          }

          .stat {
            border: 1px solid rgba(184, 194, 204, 0.14);
            border-radius: 8px;
            background: rgba(13, 17, 23, 0.78);
            padding: 0.85rem;
          }

          .stat span {
            display: block;
            color: var(--muted);
            font-size: 0.78rem;
            font-weight: 750;
            text-transform: uppercase;
          }

          .stat strong {
            display: block;
            margin-top: 0.25rem;
            color: var(--text);
            font-size: 1.45rem;
            line-height: 1;
          }

          .panel {
            border: 1px solid rgba(184, 194, 204, 0.14);
            border-radius: 10px;
            background:
              linear-gradient(180deg, rgba(17, 24, 33, 0.92), rgba(9, 12, 17, 0.94));
            margin: 1.2rem 0 2rem;
            overflow: hidden;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
          }

          .panel-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            border-bottom: 1px solid rgba(184, 194, 204, 0.12);
            padding: 0.9rem 1rem;
          }

          .panel-head h2 {
            margin: 0;
            font-size: 1rem;
          }

          .panel-head p {
            margin: 0;
            color: var(--muted);
            font-size: 0.9rem;
          }

          .table-wrap {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            min-width: 780px;
          }

          th,
          td {
            border-bottom: 1px solid rgba(184, 194, 204, 0.1);
            padding: 0.78rem 1rem;
            text-align: left;
            vertical-align: middle;
          }

          th {
            background: rgba(6, 7, 8, 0.5);
            color: var(--muted);
            font-size: 0.78rem;
            font-weight: 800;
            text-transform: uppercase;
          }

          td {
            color: var(--soft);
            font-size: 0.94rem;
          }

          tr:hover td {
            background: rgba(91, 167, 247, 0.055);
          }

          .url {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            min-width: 0;
            color: #dfefff;
            font-weight: 720;
          }

          .dot {
            width: 0.5rem;
            height: 0.5rem;
            flex: 0 0 auto;
            border-radius: 999px;
            background: var(--blue);
            box-shadow: 0 0 16px rgba(139, 197, 255, 0.28);
          }

          .type {
            display: inline-flex;
            align-items: center;
            border: 1px solid rgba(139, 197, 255, 0.2);
            border-radius: 999px;
            background: rgba(91, 167, 247, 0.08);
            color: #cde9ff;
            font-size: 0.76rem;
            font-weight: 800;
            line-height: 1;
            padding: 0.32rem 0.48rem;
            white-space: nowrap;
          }

          .priority {
            color: var(--gold);
            font-weight: 800;
          }

          .foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            border-top: 1px solid rgba(184, 194, 204, 0.12);
            color: var(--muted);
            font-size: 0.88rem;
            padding: 1rem 0 1.5rem;
          }

          @media (max-width: 760px) {
            .topbar-inner,
            .foot {
              align-items: flex-start;
              flex-direction: column;
            }

            .nav {
              flex-wrap: wrap;
            }

            .stats {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .panel-head {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        </style>
      </head>
      <body>
        <header class="topbar">
          <div class="wrap topbar-inner">
            <a class="brand" href="/">
              <img src="android-chrome-192x192.png" alt=""/>
              <span>lokii.tech</span>
            </a>
            <nav class="nav" aria-label="Primary navigation">
              <a href="/">Home</a>
              <a href="/#resources">Resources</a>
              <a href="/#faq">FAQ</a>
              <a href="https://github.com/UnExplainableFish52/lokii.tech">GitHub</a>
            </nav>
          </div>
        </header>

        <main class="wrap">
          <section class="hero">
            <p class="kicker">XML sitemap</p>
            <h1>All indexed lokii.tech pages</h1>
            <p class="summary">This sitemap is still valid XML for search engines. The styling is only here so humans can scan the listed pages, update dates, crawl hints, and priority values without reading raw XML.</p>

            <div class="stats" aria-label="Sitemap summary">
              <div class="stat">
                <span>Total URLs</span>
                <strong><xsl:value-of select="count(sm:urlset/sm:url)"/></strong>
              </div>
              <div class="stat">
                <span>Intro</span>
                <strong><xsl:value-of select="count(sm:urlset/sm:url[contains(sm:loc, '/intro/')])"/></strong>
              </div>
              <div class="stat">
                <span>Intermediate</span>
                <strong><xsl:value-of select="count(sm:urlset/sm:url[contains(sm:loc, '/intermediate/')])"/></strong>
              </div>
              <div class="stat">
                <span>Pro</span>
                <strong><xsl:value-of select="count(sm:urlset/sm:url[contains(sm:loc, '/pro/')])"/></strong>
              </div>
            </div>
          </section>

          <section class="panel" aria-labelledby="sitemap-table-title">
            <div class="panel-head">
              <div>
                <h2 id="sitemap-table-title">Sitemap entries</h2>
                <p>Click any URL to open the public page.</p>
              </div>
              <p><xsl:value-of select="count(sm:urlset/sm:url)"/> entries</p>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Type</th>
                    <th>Last modified</th>
                    <th>Changefreq</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sm:urlset/sm:url">
                    <tr>
                      <td>
                        <a class="url" href="{sm:loc}">
                          <span class="dot"></span>
                          <span><xsl:value-of select="sm:loc"/></span>
                        </a>
                      </td>
                      <td>
                        <span class="type">
                          <xsl:choose>
                            <xsl:when test="contains(sm:loc, '/intro/')">Intro</xsl:when>
                            <xsl:when test="contains(sm:loc, '/intermediate/')">Intermediate</xsl:when>
                            <xsl:when test="contains(sm:loc, '/pro/')">Pro</xsl:when>
                            <xsl:when test="contains(sm:loc, 'matrix.html')">Visual</xsl:when>
                            <xsl:otherwise>Core</xsl:otherwise>
                          </xsl:choose>
                        </span>
                      </td>
                      <td><xsl:value-of select="sm:lastmod"/></td>
                      <td><xsl:value-of select="sm:changefreq"/></td>
                      <td class="priority"><xsl:value-of select="sm:priority"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer class="wrap foot">
          <span>Generated for lokii.tech search indexing and human review.</span>
          <a href="/robots.txt">robots.txt</a>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
