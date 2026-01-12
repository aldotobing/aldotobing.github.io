// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const html = document.documentElement;
const nav = document.querySelector('nav');

// Navbar scroll behavior
let lastScroll = 0;
const navbar = document.querySelector('nav');
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Apply to all screen sizes
    if (currentScroll <= 0) {
        // At the top of the page
        navbar.classList.remove('hide-nav');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > navbarHeight) {
        // Scrolling down
        navbar.classList.add('hide-nav');
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        navbar.classList.remove('hide-nav');
    }
    
    lastScroll = currentScroll;
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
} else {
    // Check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    html.setAttribute('data-theme', systemTheme);
    updateThemeIcon(systemTheme);
}

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Only proceed if the button exists
    if (!backToTopButton) return;
    
    let isScrolling;
    let scrollTimer;
    
    // Function to show the button
    function showButton() {
        backToTopButton.classList.add('visible');
    }
    
    // Function to hide the button
    function hideButton() {
        backToTopButton.classList.remove('visible');
    }
    
    // Function to handle scroll events
    function handleScroll() {
        // Hide button when scrolling starts
        hideButton();
        
        // Clear any existing timeout
        window.clearTimeout(scrollTimer);
        
        // Only show if scrolled more than 300px
        if (window.scrollY > 300) {
            // Set a timeout to show the button when scrolling stops
            scrollTimer = setTimeout(showButton, 300);
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check in case page loads scrolled
    if (window.scrollY > 300) {
        showButton();
    }
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

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

// Navbar hide on scroll down, show on scroll up
let lastScrollTop = 0;

// This functionality is now handled by the scroll event listener at the top of the file
// which uses requestAnimationFrame for better performance

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

// Add loading animation when page loads
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            `;

    const loader = document.createElement('div');
    loader.className = 'loading';
    loader.style.width = '50px';
    loader.style.height = '50px';
    loader.style.borderWidth = '5px';

    preloader.appendChild(loader);
    document.body.prepend(preloader);

    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }, 1000);
});