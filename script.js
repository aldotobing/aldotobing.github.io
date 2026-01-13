// Theme Handling
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
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
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Navbar and Scroll handling
const navBackToTop = document.getElementById('navBackToTop');
const navControlLi = document.querySelector('.nav-control-li');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Toggle between Theme Switch and Back to Top
    if (currentScroll > 300) {
        navControlLi.classList.add('scrolled');
    } else {
        navControlLi.classList.remove('scrolled');
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

// Smooth Scrolling and Active Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active navigation on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Typing Animation
const typingText = document.getElementById('typing-text');
const words = ['Software Developer', 'Backend Engineer', 'DevOps Specialist', 'System Administrator'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentWord = words[wordIndex];

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

typeWriter();

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

// Cards hover effect handled by CSS for better performance
// const cards = document.querySelectorAll('.skill-card, .project-card, .stat-card'); ... handled in CSS

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * -0.2}px)`;
    }
});

// Premium Splash Screen Handler
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    
    // Ensure the splash screen stays for at least the duration of the animations (2.2s total)
    // plus a small buffer for smooth transition
    setTimeout(() => {
        splashScreen.classList.add('splash-hidden');
        
        // Remove from DOM after fade out to save memory
        setTimeout(() => {
            splashScreen.remove();
            document.body.classList.add('loaded'); // Trigger hero animations
        }, 800);
    }, 2200);
});

// Toggle Project Description
document.querySelectorAll('.project-description').forEach(desc => {
    desc.addEventListener('click', () => {
        desc.classList.toggle('expanded');
    });
});