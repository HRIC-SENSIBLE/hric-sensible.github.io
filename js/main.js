/**
 * SENSIBLE Project Website - Main JavaScript
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
    // Video Control (Play/Pause) - 支持多个视频
    // ========================================
    const videoControl = document.querySelector('.video-control');
    // 选择所有 hero-video 元素（包括 bg 和 main）
    const heroVideos = document.querySelectorAll('.hero-video');
    
    if (videoControl && heroVideos.length > 0) {
        // 播放/暂停所有视频
        videoControl.addEventListener('click', function() {
            const icon = videoControl.querySelector('i');
            // 检查第一个视频的状态来决定操作
            const firstVideo = heroVideos[0];
            
            if (firstVideo.paused) {
                // 播放所有视频
                heroVideos.forEach(video => {
                    video.play().catch(err => console.log('Video play error:', err));
                });
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                // 暂停所有视频
                heroVideos.forEach(video => {
                    video.pause();
                });
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
        
        // 监听主视频的状态变化来更新图标
        const mainVideo = document.querySelector('.hero-video--main') || heroVideos[0];
        
        mainVideo.addEventListener('pause', function() {
            const icon = videoControl.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
        
        mainVideo.addEventListener('play', function() {
            const icon = videoControl.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        });
        
        // 同步两个视频的播放时间（可选，防止不同步）
        if (heroVideos.length > 1) {
            const bgVideo = document.querySelector('.hero-video--bg');
            const mainVideoEl = document.querySelector('.hero-video--main');
            
            if (bgVideo && mainVideoEl) {
                // 当主视频 seek 时，同步背景视频
                mainVideoEl.addEventListener('seeked', function() {
                    bgVideo.currentTime = mainVideoEl.currentTime;
                });
                
                // 定期同步（每5秒检查一次）
                setInterval(function() {
                    if (!mainVideoEl.paused && Math.abs(bgVideo.currentTime - mainVideoEl.currentTime) > 0.5) {
                        bgVideo.currentTime = mainVideoEl.currentTime;
                    }
                }, 5000);
            }
        }
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
    // Scroll Animations
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
    
    const animatedElements = document.querySelectorAll(
        '.feature-card, .partner-item, .member-card, .work-package, .publication-item, .event-item, .press-item, .demo-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
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
    if (heroVideos.length > 0) {
        heroVideos.forEach(video => {
            video.addEventListener('error', function() {
                const poster = document.querySelector('.hero-poster');
                if (poster) {
                    poster.style.display = 'block';
                    heroVideos.forEach(v => v.style.display = 'none');
                }
            });
        });
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
            if (touchStarted && window.innerWidth <= 768) {
                if (!item.classList.contains('dropdown-open')) {
                    e.preventDefault();
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
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown')) {
            dropdownItems.forEach(item => {
                item.classList.remove('dropdown-open');
            });
        }
    });
    
    console.log('SENSIBLE website initialized successfully.');

    // ========================================
    // Lightbox for Event Images
    // ========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Click image to open lightbox
        document.querySelectorAll('.event-image img').forEach(img => {
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox - click X
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close lightbox - click background
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close lightbox - press ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Video Lightbox for Demo Videos
    // ========================================
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const videoLightboxClose = document.querySelector('.video-lightbox-close');

    if (videoLightbox) {
        // Click video to open lightbox
        document.querySelectorAll('.demo-video-player').forEach(video => {
            video.addEventListener('click', function(e) {
                // Only trigger lightbox on single click, not on controls
                if (e.target === this) {
                    e.preventDefault();
                    this.pause();
                    lightboxVideo.querySelector('source').src = this.querySelector('source').src;
                    lightboxVideo.load();
                    lightboxVideo.currentTime = this.currentTime;
                    videoLightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    lightboxVideo.play();
                }
            });
        });

        // Close function
        function closeVideoLightbox() {
            lightboxVideo.pause();
            videoLightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close - click X
        videoLightboxClose.addEventListener('click', closeVideoLightbox);

        // Close - click background
        videoLightbox.addEventListener('click', function(e) {
            if (e.target === videoLightbox) {
                closeVideoLightbox();
            }
        });

        // Close - press ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoLightbox.classList.contains('active')) {
                closeVideoLightbox();
            }
        });
    }
});