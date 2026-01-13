// Theme Handling
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    
    // Premium icon transition
    themeIcon.style.transform = 'scale(0) rotate(-90deg)';
    themeIcon.style.opacity = '0';
    
    setTimeout(() => {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        themeIcon.style.transform = 'scale(1) rotate(0deg)';
        themeIcon.style.opacity = '1';
    }, 250);
}

function setTheme(theme, save = true) {
    html.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    if (save) localStorage.setItem('theme', theme);
}

// Initial theme setup
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme, false);
} else {
    setTheme(themeMediaQuery.matches ? 'light' : 'dark', false);
}

// Listen for system theme changes (only if no manual override)
themeMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark', false);
    }
});

// Manual toggle
if (themeToggle) {
    themeToggle.addEventListener('click', (event) => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Get click coordinates or fallback to button center
        let x, y;
        if (event.clientX !== undefined && event.clientY !== undefined && event.clientX !== 0 && event.clientY !== 0) {
            x = event.clientX;
            y = event.clientY;
        } else {
            const rect = themeToggle.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        // Premium View Transition
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
        });

        transition.ready.then(() => {
            // Add a safety class to disable heavy filters during transition
            document.body.classList.add('transitioning-theme');
            
            document.documentElement.animate(
                [
                    { clipPath: `circle(0px at ${x}px ${y}px)` },
                    { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
                ],
                {
                    duration: 600,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    pseudoElement: '::view-transition-new(root)',
                }
            );

            transition.finished.finally(() => {
                document.body.classList.remove('transitioning-theme');
            });
        });
    });
}

// Navbar and Scroll handling
const navBackToTop = document.getElementById('navBackToTop');
const navControlLi = document.querySelector('.nav-control-li');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const navIndicator = document.querySelector('.nav-indicator-pill');
let isScrollingFromClick = false; // Lock to prevent hopping

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Toggle between Theme Switch and Back to Top
    if (currentScroll > 300) {
        if (navControlLi) navControlLi.classList.add('scrolled');
    } else {
        if (navControlLi) navControlLi.classList.remove('scrolled');
    }
});

// Nav Back to Top Click Handler
if (navBackToTop) {
    navBackToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function updateNavIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    const navList = document.querySelector('nav ul');
    if (activeLink && navIndicator && navList) {
        const linkRect = activeLink.getBoundingClientRect();
        const listRect = navList.getBoundingClientRect();
        
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${linkRect.left - listRect.left}px`;
        navIndicator.style.opacity = '1';
    }
}

// Continuous tracking during transitions
let indicatorFrame;
function trackIndicator() {
    updateNavIndicator();
    indicatorFrame = requestAnimationFrame(trackIndicator);
}

// Navbar link click with premium reveal
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            isScrollingFromClick = true;
            
            // 1. IMMEDIATE UI UPDATE
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavIndicator();
            
            // 2. PREPARE SECTION REVEAL
            const originalTransition = targetSection.style.transition;
            targetSection.style.transition = 'none';
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            // 3. EXECUTE SCROLL AFTER PAINT
            requestAnimationFrame(() => {
                // Start tracking animation for the pill
                trackIndicator();
                
                // Increase tracking duration to ensure the pill follows any layout shifts
                setTimeout(() => cancelAnimationFrame(indicatorFrame), 1200);

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Fade and slide in the section
                setTimeout(() => {
                    targetSection.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                    
                    // Release the lock only after the smooth scroll and fade-in are fully complete
                    setTimeout(() => {
                        isScrollingFromClick = false;
                        // Reset inline styles
                        setTimeout(() => {
                            targetSection.style.opacity = '';
                            targetSection.style.transform = '';
                            targetSection.style.transition = originalTransition;
                        }, 800);
                    }, 800); // Increased from 200ms to 800ms to cover scroll duration
                }, 300);
            });
        }
    });
});

// Update active navigation on scroll
window.addEventListener('scroll', () => {
    if (isScrollingFromClick) return;

    const scrollPosition = window.scrollY + 200;
    let currentActive = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentActive = sectionId;
        }
    });

    if (currentActive) {
        let changed = false;
        navLinks.forEach(link => {
            const isMatch = link.getAttribute('href') === `#${currentActive}`;
            if (isMatch && !link.classList.contains('active')) {
                link.classList.add('active');
                changed = true;
            } else if (!isMatch && link.classList.contains('active')) {
                link.classList.remove('active');
                changed = true;
            }
        });

        if (changed) {
            trackIndicator();
            setTimeout(() => cancelAnimationFrame(indicatorFrame), 600);
        }
    }
});

// Initialize indicator
window.addEventListener('load', () => {
    setTimeout(updateNavIndicator, 100); // Small delay to ensure layout is ready
});
window.addEventListener('resize', updateNavIndicator);

// Typing Animation
const typingText = document.getElementById('typing-text');
const words = ['Software Developer', 'Backend Engineer', 'DevOps Specialist', 'System Administrator'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentWord = words[wordIndex] || "";

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeWriter, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeWriter, 500);
    } else {
        setTimeout(typeWriter, isDeleting ? 50 : 100);
    }
}

if (typingText) typeWriter();

// Liquid Background Animation
function createLiquidBackground() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    // Clear existing content if any
    heroBg.innerHTML = '';

    // Create 3 large floating blobs
    const colors = [
        'rgba(41, 151, 255, 0.4)',  // Blue
        'rgba(191, 90, 242, 0.4)',  // Purple
        'rgba(50, 215, 75, 0.3)'    // Greenish hint
    ];

    for (let i = 0; i < 3; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';
        
        // Random sizes between 40vw and 70vw
        const size = Math.floor(Math.random() * 30) + 40;
        
        blob.style.cssText = `
            position: absolute;
            width: ${size}vw;
            height: ${size}vw;
            background: radial-gradient(circle, ${colors[i]} 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.6;
            animation: moveBlob${i} ${20 + i * 5}s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
            top: ${Math.random() * 50}%;
            left: ${Math.random() * 50}%;
        `;

        heroBg.appendChild(blob);
    }

    // Add CSS for blobs programmatically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes moveBlob0 {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(20vw, 20vh) scale(1.1); }
        }
        @keyframes moveBlob1 {
            0% { transform: translate(0, 0) scale(1.1); }
            100% { transform: translate(-20vw, 10vh) scale(0.9); }
        }
        @keyframes moveBlob2 {
            0% { transform: translate(0, 0) scale(0.9); }
            100% { transform: translate(10vw, -20vh) scale(1.1); }
        }
    `;
    document.head.appendChild(styleSheet);
}

createLiquidBackground();

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animation elements
const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
animateElements.forEach(el => observer.observe(el));

// Contact Form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show loading state
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#10b981';

            // Reset form
            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * -0.2}px)`;
    }
});

// Premium Splash Screen Handler
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    
    if (splashScreen) {
        setTimeout(() => {
            // Start both animations at the same time for a seamless transition
            splashScreen.classList.add('splash-hidden');
            document.body.classList.add('loaded');
            
            // Remove splash from DOM after transition completes
            setTimeout(() => {
                splashScreen.remove();
                
                // Delay navbar appearance until hero is shown
                const mainNav = document.querySelector('nav');
                if (mainNav) {
                    setTimeout(() => {
                        mainNav.classList.add('nav-visible');
                    }, 1000); // 1s delay for a more orchestrated feel
                }
            }, 1000);
        }, 2000);
    } else {
        document.body.classList.add('loaded');
    }
});

// Toggle Project Description
document.querySelectorAll('.project-description').forEach(desc => {
    desc.addEventListener('click', () => {
        desc.classList.toggle('expanded');
    });
});
