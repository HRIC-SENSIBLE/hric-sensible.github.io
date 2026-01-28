/**
 * Drones4Energy Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!event.target.closest('.nav-container')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // ========================================
    // Video Control (Play/Pause)
    // ========================================
    const videoControl = document.querySelector('.video-control');
    const heroVideo = document.querySelector('.hero-video');
    
    if (videoControl && heroVideo) {
        videoControl.addEventListener('click', function() {
            const icon = videoControl.querySelector('i');
            if (heroVideo.paused) {
                heroVideo.play();
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                heroVideo.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
        
        // Update button state if video pauses/plays externally
        heroVideo.addEventListener('pause', function() {
            const icon = videoControl.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
        
        heroVideo.addEventListener('play', function() {
            const icon = videoControl.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        });
    }
    
    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========================================
    // Scroll Animations (Fade-in effect)
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .partner-item, .member-card, .work-package, .publication-item, .event-item, .press-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ========================================
    // Handle Video Loading Fallback
    // ========================================
    if (heroVideo) {
        heroVideo.addEventListener('error', function() {
            const poster = document.querySelector('.hero-poster');
            if (poster) {
                poster.style.display = 'block';
                heroVideo.style.display = 'none';
            }
        });
        
        // If video source is empty, show poster
        if (!heroVideo.querySelector('source')?.src || heroVideo.querySelector('source')?.src === '') {
            const poster = document.querySelector('.hero-poster');
            if (poster) {
                poster.style.display = 'block';
            }
        }
    }
    
    // ========================================
    // Dropdown Menu for Touch Devices
    // ========================================
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        let touchStarted = false;
        
        link.addEventListener('touchstart', function(e) {
            touchStarted = true;
        });
        
        link.addEventListener('click', function(e) {
            // On touch devices, first tap opens dropdown, second tap navigates
            if (touchStarted && window.innerWidth <= 768) {
                if (!item.classList.contains('dropdown-open')) {
                    e.preventDefault();
                    // Close other dropdowns
                    dropdownItems.forEach(other => {
                        if (other !== item) {
                            other.classList.remove('dropdown-open');
                        }
                    });
                    item.classList.add('dropdown-open');
                }
            }
            touchStarted = false;
        });
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown')) {
            dropdownItems.forEach(item => {
                item.classList.remove('dropdown-open');
            });
        }
    });
    
    // ========================================
    // Active Navigation Highlighting
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu > li');
    
    navLinks.forEach(item => {
        const link = item.querySelector('a');
        const href = link?.getAttribute('href');
        
        if (href) {
            const linkPage = href.split('/').pop();
            if (linkPage === currentPage) {
                item.classList.add('active');
            } else {
                // Check dropdown items too
                const dropdownLinks = item.querySelectorAll('.dropdown a');
                dropdownLinks.forEach(dropLink => {
                    const dropHref = dropLink.getAttribute('href');
                    if (dropHref && dropHref.split('/').pop() === currentPage) {
                        item.classList.add('active');
                    }
                });
            }
        }
    });
    
    // ========================================
    // Lazy Loading Images
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    console.log('Drones4Energy website initialized successfully.');
});
