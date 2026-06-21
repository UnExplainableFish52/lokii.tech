/**
 * LOKII.TECH - Main JavaScript
 * Shared functionality for all pages
 * Provides navbar, floating navigation controls, and other utilities
 */

(function () {
    'use strict';

    const SELECTORS = {
        actions: '.global-floating-actions',
        homeButton: '.floating-home-btn',
        scrollButton: '.scroll-to-top-btn',
        siteFooter: '.site-footer'
    };

    function getCurrentScript() {
        if (document.currentScript && document.currentScript.src) {
            return document.currentScript;
        }

        return Array.from(document.scripts).find(script => /\/js\/main\.js$/.test(script.src));
    }

    function getSiteRootUrl() {
        const script = getCurrentScript();

        if (script && script.src) {
            return new URL('../', script.src);
        }

        return new URL('/', window.location.href);
    }

    function buildRootUrl(path) {
        return new URL(path.replace(/^\/+/, ''), getSiteRootUrl()).href;
    }

    function findStylesheet(pathSuffix) {
        return Array.from(document.querySelectorAll('link[rel~="stylesheet"]')).find(link => {
            try {
                return new URL(link.getAttribute('href'), document.baseURI).pathname.endsWith(pathSuffix);
            } catch (error) {
                return false;
            }
        });
    }

    function appendStylesheet(path, markerName) {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = buildRootUrl(path);
        stylesheet.dataset[markerName] = 'true';
        document.head.appendChild(stylesheet);
        return stylesheet;
    }

    function ensureStylesheetLast(path, pathSuffix, markerName) {
        const stylesheet = findStylesheet(pathSuffix) || appendStylesheet(path, markerName);
        document.head.appendChild(stylesheet);
        return stylesheet;
    }

    function initThemeLayer() {
        const hasSharedStyles = Boolean(findStylesheet('/css/style.css'));

        if (isLearningPage()) {
            document.body.classList.add('learning-note-page');
        }

        if (!hasSharedStyles) {
            document.body.classList.add('legacy-lesson-page');
        }

        ensureStylesheetLast('css/style.css', '/css/style.css', 'lokiiSharedStyles');
        ensureStylesheetLast('css/global-ui.css', '/css/global-ui.css', 'lokiiGlobalUi');
    }

    function isHomePage() {
        const pathname = window.location.pathname.replace(/\\/g, '/');
        return pathname === '/' ||
            pathname.endsWith('/index.html') ||
            pathname === '/index.html' ||
            (pathname.endsWith('/') && !pathname.includes('.html'));
    }

    function isLearningPage() {
        const pathname = window.location.pathname.replace(/\\/g, '/');
        return !isHomePage() && !pathname.endsWith('/matrix.html');
    }

    /**
     * Initialize the navbar component
     * Dynamically generates and injects the navbar based on page location
     */
    function initNavbar() {
        // Check if navbar placeholder exists or if we should prepend to body
        const placeholder = document.getElementById('navbar-placeholder');

        const onHomePage = isHomePage();
        const homeLink = buildRootUrl('index.html');
        const aboutLink = onHomePage ? '#about' : buildRootUrl('index.html#about');
        const resourcesLink = onHomePage ? '#resources' : buildRootUrl('index.html#resources');
        const faqLink = onHomePage ? '#faq' : buildRootUrl('index.html#faq');

        // Generate navbar HTML
        const navbarHTML = `
            <header class="site-header">
                <div class="container">
                    <div class="header-content">
                        <a href="${homeLink}" class="branding">
                            <span class="logo">lokii.tech</span>
                        </a>
                        <button class="nav-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false" aria-label="Open navigation menu">
                            <span class="nav-toggle-line"></span>
                            <span class="nav-toggle-line"></span>
                            <span class="nav-toggle-line"></span>
                        </button>
                        <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">
                            <a href="${aboutLink}" class="nav-link nav-link-enhanced">About</a>
                            <a href="${resourcesLink}" class="nav-link nav-link-enhanced">Resources</a>
                            <a href="${faqLink}" class="nav-link nav-link-enhanced">FAQ</a>
                            <a href="https://github.com/UnExplainableFish52/lokii.tech" target="_blank" rel="noopener noreferrer" class="nav-link nav-link-enhanced">GitHub</a>
                            <a href="https://github.com/UnExplainableFish52/lokii.tech/issues" target="_blank" rel="noopener noreferrer" class="nav-link nav-contribute">Contribute</a>
                        </nav>
                    </div>
                </div>
            </header>
        `;

        // Insert navbar
        const existingHeader = document.querySelector('.site-header');

        if (placeholder) {
            placeholder.outerHTML = navbarHTML;
        } else if (existingHeader) {
            existingHeader.outerHTML = navbarHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
    }

    function initMobileNav() {
        const header = document.querySelector('.site-header');
        const toggle = header ? header.querySelector('.nav-toggle') : null;
        const nav = header ? header.querySelector('.nav-links') : null;
        const mobileNavQuery = window.matchMedia('(max-width: 860px)');

        if (!header || !toggle || !nav) {
            return;
        }

        function syncNavAccessibility(isOpen) {
            if (!mobileNavQuery.matches) {
                nav.removeAttribute('aria-hidden');
                nav.inert = false;
                return;
            }

            nav.setAttribute('aria-hidden', String(!isOpen));
            nav.inert = !isOpen;
        }

        function setMenuState(isOpen, returnFocus) {
            const shouldOpen = Boolean(isOpen) && mobileNavQuery.matches;

            header.classList.toggle('nav-open', shouldOpen);
            toggle.setAttribute('aria-expanded', String(shouldOpen));
            toggle.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
            syncNavAccessibility(shouldOpen);

            if (!shouldOpen && returnFocus && nav.contains(document.activeElement)) {
                toggle.focus();
            }
        }

        toggle.addEventListener('click', function () {
            setMenuState(!header.classList.contains('nav-open'));
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                setMenuState(false);
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && header.classList.contains('nav-open')) {
                setMenuState(false, true);
            }
        });

        document.addEventListener('click', function (event) {
            if (header.classList.contains('nav-open') && !header.contains(event.target)) {
                setMenuState(false);
            }
        });

        if (typeof mobileNavQuery.addEventListener === 'function') {
            mobileNavQuery.addEventListener('change', function () {
                setMenuState(false);
            });
        } else if (typeof mobileNavQuery.addListener === 'function') {
            mobileNavQuery.addListener(function () {
                setMenuState(false);
            });
        }

        setMenuState(false);
    }

    function buildFooterHTML() {
        const year = new Date().getFullYear();

        return `
            <div class="container">
                <div class="footer-content">
                    <section class="footer-brand" aria-label="lokii.tech summary">
                        <a href="${buildRootUrl('index.html')}" class="footer-logo" aria-label="lokii.tech home">
                            <span class="footer-logo-mark"><img src="${buildRootUrl('android-chrome-192x192.png')}" alt=""></span>
                            <span>lokii.tech</span>
                        </a>
                        <p class="footer-summary">Free FOSS cybersecurity and systems notes, practical tools, GRC workflows, and project guides for building real technical skill.</p>
                        <div class="footer-topic-row" aria-label="Core topics">
                            <a href="${buildRootUrl('index.html#resources')}">Cybersecurity</a>
                            <a href="${buildRootUrl('index.html#resources')}">Linux</a>
                            <a href="${buildRootUrl('index.html#resources')}">Networking</a>
                            <a href="${buildRootUrl('index.html#resources')}">Shell scripting</a>
                            <a href="${buildRootUrl('index.html#resources')}">GRC</a>
                            <a href="${buildRootUrl('index.html#resources')}">Security projects</a>
                        </div>
                    </section>

                    <aside class="footer-contribute" aria-label="Open source contribution">
                        <p>Open source and built to improve in public. Corrections, clearer examples, and useful new resources are welcome.</p>
                        <a href="https://github.com/UnExplainableFish52/lokii.tech/issues" target="_blank" rel="noopener noreferrer">Contribute on GitHub</a>
                    </aside>

                    <nav class="footer-link-groups" aria-label="Footer navigation">
                        <section class="footer-section">
                            <h4>Learn</h4>
                            <ul>
                                <li><a href="${buildRootUrl('index.html#resources')}">All resources</a></li>
                                <li><a href="${buildRootUrl('intro/notes/1.1-what-is-cybersecurity.html')}">Cybersecurity foundation</a></li>
                                <li><a href="${buildRootUrl('intro/notes/1.5_networks.html')}">Networking basics</a></li>
                                <li><a href="${buildRootUrl('intermediate/notes/linux_course.html')}">Linux course</a></li>
                                <li><a href="${buildRootUrl('pro/security-professional-project-guide.html')}">Project roadmap</a></li>
                            </ul>
                        </section>
                        <section class="footer-section">
                            <h4>Topics</h4>
                            <ul>
                                <li><a href="${buildRootUrl('intro/notes/1.2-glossary.html')}">Cybersecurity glossary</a></li>
                                <li><a href="${buildRootUrl('intro/notes/1.7-shell-scripting.html')}">Shell scripting</a></li>
                                <li><a href="${buildRootUrl('intro/notes/grc-foundation.html')}">GRC foundation</a></li>
                                <li><a href="${buildRootUrl('intermediate/tools/nmap.html')}">Nmap scanning</a></li>
                                <li><a href="${buildRootUrl('pro/wireshark-packet-capture-analysis.html')}">Wireshark analysis</a></li>
                            </ul>
                        </section>
                        <section class="footer-section">
                            <h4>Project</h4>
                            <ul>
                                <li><a href="${buildRootUrl('index.html#about')}">About</a></li>
                                <li><a href="${buildRootUrl('index.html#faq')}">FAQ</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/lokii.tech" target="_blank" rel="noopener noreferrer">Source code</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/lokii.tech/issues" target="_blank" rel="noopener noreferrer">Issues and suggestions</a></li>
                                <li><a href="${buildRootUrl('sitemap.xml')}">Sitemap</a></li>
                            </ul>
                        </section>
                        <section class="footer-section">
                            <h4>Developer</h4>
                            <ul>
                                <li><a href="https://github.com/UnExplainableFish52" target="_blank" rel="noopener noreferrer">GitHub profile</a></li>
                                <li><a href="https://blogs.sakshamsharma.com.np/" target="_blank" rel="noopener noreferrer">Writings and reflections</a></li>
                                <li><a href="https://saksham.info.np/" target="_blank" rel="noopener noreferrer">Professional profile</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/Fumic" target="_blank" rel="noopener noreferrer">Fumic media player</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/Frodigy" target="_blank" rel="noopener noreferrer">Frodigy productivity app</a></li>
                            </ul>
                        </section>
                    </nav>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${year} lokii.tech. Free and open-source cybersecurity, systems, Linux, networking, GRC, and project practice. <a href="${buildRootUrl('LICENSE')}">See License</a></p>
                </div>
            </div>
        `;
    }

    function initFooter() {
        let footer = document.querySelector(SELECTORS.siteFooter);

        document.querySelectorAll('footer:not(.site-footer), body.legacy-lesson-page > .footer').forEach(existingFooter => {
            existingFooter.remove();
        });

        if (!footer) {
            footer = document.createElement('footer');
            footer.className = 'site-footer';
            document.body.appendChild(footer);
        }

        footer.innerHTML = buildFooterHTML();
    }

    /**
     * Get or create the shared floating action stack.
     */
    function getFloatingActions() {
        let actions = document.querySelector(SELECTORS.actions);

        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'global-floating-actions';
            actions.setAttribute('aria-label', 'Page quick actions');
            document.body.appendChild(actions);
        }

        return actions;
    }

    /**
     * Initialize floating home button.
     * Only shows on pages other than the homepage.
     */
    function initFloatingHomeButton() {
        if (isHomePage() || document.querySelector(SELECTORS.homeButton)) {
            return;
        }

        const actions = getFloatingActions();
        const homeButton = document.createElement('a');
        homeButton.href = buildRootUrl('index.html');
        homeButton.className = 'floating-home-btn';
        homeButton.setAttribute('aria-label', 'Go to homepage');
        homeButton.setAttribute('title', 'Back to Home');
        homeButton.innerHTML = '⌂';

        actions.appendChild(homeButton);
    }

    /**
     * Initialize scroll-to-top button.
     * Shows when user scrolls down the page.
     */
    function initScrollToTopButton() {
        if (document.querySelector(SELECTORS.scrollButton)) {
            return;
        }

        const actions = getFloatingActions();
        const scrollButton = document.createElement('button');
        scrollButton.type = 'button';
        scrollButton.className = 'scroll-to-top-btn';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.setAttribute('title', 'Scroll to Top');
        scrollButton.innerHTML = '↑';

        actions.insertBefore(scrollButton, actions.firstChild);

        // Scroll threshold (show button after scrolling 300px)
        const scrollThreshold = 300;

        // Handle scroll event with debounce for performance
        let scrollTimeout;
        function handleScroll() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function () {
                if (window.scrollY > scrollThreshold) {
                    scrollButton.classList.add('visible');
                } else {
                    scrollButton.classList.remove('visible');
                }
            });
        }

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle click - scroll to top
        scrollButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Check initial scroll position
        handleScroll();
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        initThemeLayer();
        initNavbar();
        initMobileNav();
        initFooter();
        initFloatingHomeButton();
        initScrollToTopButton();
        initSmoothScrolling();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
