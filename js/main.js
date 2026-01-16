/**
 * LOKII.TECH - Main JavaScript
 * Shared functionality for all pages
 * Provides navbar, floating home navigation button and other utilities
 */

(function () {
    'use strict';

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

        // Detect page depth by counting path segments
        const pathname = window.location.pathname;
        const isHomePage = pathname === '/' ||
            pathname.endsWith('/index.html') ||
            pathname === '/index.html' ||
            (pathname.endsWith('/') && !pathname.includes('.html'));

        // Calculate base path for links
        let basePath = '';
        if (!isHomePage) {
            // Count directory levels from root
            const pathParts = pathname.split('/').filter(p => p && !p.includes('.html'));
            basePath = pathParts.map(() => '..').join('/');
            if (basePath) basePath = basePath;
        }

        // Build link paths
        const homeLink = isHomePage ? '/' : (basePath ? basePath + '/index.html' : '/index.html');
        const aboutLink = isHomePage ? '#about' : (basePath ? basePath + '/index.html#about' : '/index.html#about');
        const resourcesLink = isHomePage ? '#resources' : (basePath ? basePath + '/index.html#resources' : '/index.html#resources');

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
     * Initialize floating home button
     * Only shows on pages other than index.html
     */
    function initFloatingHomeButton() {
        const currentPath = window.location.pathname;

        // Check if we're on the homepage
        const isHomePage = currentPath === '/' ||
            currentPath.endsWith('/index.html') ||
            (currentPath.endsWith('/') && !currentPath.includes('.html'));

        // Don't show on homepage
        if (isHomePage) {
            return;
        }

        // Create the floating button
        const floatingBtn = document.createElement('a');
        floatingBtn.href = '/index.html';
        floatingBtn.className = 'floating-home-btn';
        floatingBtn.setAttribute('aria-label', 'Go to homepage');
        floatingBtn.setAttribute('title', 'Back to Home');
        floatingBtn.innerHTML = '🏠';

        // Append to body
        document.body.appendChild(floatingBtn);

        // Add smooth scroll behavior when clicked
        floatingBtn.addEventListener('click', function (e) {
            // Allow default navigation but add a small delay for visual feedback
            e.preventDefault();
            floatingBtn.style.transform = 'scale(0.95)';
            setTimeout(function () {
                window.location.href = '/index.html';
            }, 150);
        });
    }

    /**
     * Initialize scroll-to-top button
     * Shows when user scrolls down 300px
     */
    function initScrollToTopButton() {
        // Create the scroll-to-top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top-btn';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.setAttribute('title', 'Scroll to Top');
        scrollBtn.innerHTML = '↑';

        // Append to body
        document.body.appendChild(scrollBtn);

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
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });
        }

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle click - scroll to top
        scrollBtn.addEventListener('click', function () {
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
