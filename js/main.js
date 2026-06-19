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
                        <nav class="nav-links" aria-label="Primary navigation">
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

    function buildFooterHTML() {
        const year = new Date().getFullYear();

        return `
            <div class="container">
                <div class="footer-content">
                    <section class="footer-section footer-brand">
                        <a href="${buildRootUrl('index.html')}" class="footer-logo">lokii.tech</a>
                        <p>Free cybersecurity, systems, Linux, networking, GRC, and security project notes for learners who want a clear technical path.</p>
                    </section>
                    <div class="footer-link-groups">
                        <section class="footer-section">
                            <h4>Learn</h4>
                            <ul>
                                <li><a href="${buildRootUrl('index.html#resources')}">All resources</a></li>
                                <li><a href="${buildRootUrl('intro/notes/1.1-what-is-cybersecurity.html')}">Beginner path</a></li>
                                <li><a href="${buildRootUrl('intermediate/notes/linux_course.html')}">Linux course</a></li>
                                <li><a href="${buildRootUrl('pro/security-professional-project-guide.html')}">Project roadmap</a></li>
                            </ul>
                        </section>
                        <section class="footer-section">
                            <h4>Project</h4>
                            <ul>
                                <li><a href="${buildRootUrl('index.html#about')}">About</a></li>
                                <li><a href="${buildRootUrl('index.html#faq')}">FAQ</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/lokii.tech" target="_blank" rel="noopener noreferrer">Source code</a></li>
                                <li><a href="https://github.com/UnExplainableFish52/lokii.tech/issues" target="_blank" rel="noopener noreferrer">Contribute</a></li>
                            </ul>
                        </section>
                        <section class="footer-section">
                            <h4>Developer</h4>
                            <ul>
                                <li><a href="https://github.com/UnExplainableFish52" target="_blank" rel="noopener noreferrer">GitHub profile</a></li>
                                <li><a href="https://blogs.sakshamsharma.com.np" target="_blank" rel="noopener noreferrer">Writings and blogs</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${year} lokii.tech. Open source and community-driven. <a href="${buildRootUrl('LICENSE')}">See License</a></p>
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
