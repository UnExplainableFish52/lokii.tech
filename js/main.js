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
        scrollButton: '.scroll-to-top-btn'
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

    function isHomePage() {
        const pathname = window.location.pathname.replace(/\\/g, '/');
        return pathname === '/' ||
            pathname.endsWith('/index.html') ||
            pathname === '/index.html' ||
            (pathname.endsWith('/') && !pathname.includes('.html'));
    }

    /**
     * Initialize the navbar component
     * Dynamically generates and injects the navbar based on page location
     */
    function initNavbar() {
        // Check if navbar placeholder exists or if we should prepend to body
        const placeholder = document.getElementById('navbar-placeholder');

        // If no placeholder and a header already exists, skip
        if (!placeholder && document.querySelector('.site-header')) {
            return;
        }

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
                        <nav class="nav-links" style="gap: 2rem;">
                            <a href="${aboutLink}" class="nav-link nav-link-enhanced">About</a>
                            <a href="${resourcesLink}" class="nav-link nav-link-enhanced">Resources</a>
                            <a href="${faqLink}" class="nav-link nav-link-enhanced">FAQ</a>
                            <a href="https://github.com/UnExplainableFish52/lokii.tech" target="_blank" class="nav-link nav-link-enhanced">GitHub</a>
                            <a href="https://github.com/UnExplainableFish52/lokii.tech/issues" target="_blank" class="nav-link nav-contribute">Contribute ✨</a>
                        </nav>
                    </div>
                </div>
            </header>
        `;

        // Insert navbar
        if (placeholder) {
            placeholder.outerHTML = navbarHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
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
        initNavbar();
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
