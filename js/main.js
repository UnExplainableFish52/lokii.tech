/**
 * LOKII.TECH - Main JavaScript
 * Shared functionality for all pages
 * Provides floating home navigation button and other utilities
 */

(function () {
    'use strict';

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
