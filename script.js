// Portfolio JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initNavbarScroll();
    initAnimations();
    initFormHandling();
    initCodeAnimation();
    initTypingEffect();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // compute header/navbar height dynamically to account for the 0.1cm increase
                const navContainer = document.querySelector('.nav-container');
                const headerOffset = navContainer ? navContainer.offsetHeight : 70;
                const offsetTop = targetSection.offsetTop - headerOffset; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .project-card, .skill-category, .contact-info, .contact-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form handling with Formspree integration
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Get form data
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Change button text to show loading
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            const formData = new FormData(this);
            
            try {
                // Send form data to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success message
                    showNotification('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    // Error message
                    const data = await response.json();
                    if (data.errors) {
                        showNotification('✗ ' + data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showNotification('✗ Oops! Something went wrong. Please try again.', 'error');
                    }
                }
            } catch (error) {
                // Network error
                console.error('Form submission error:', error);
                showNotification('✗ Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#3fb950' : type === 'error' ? '#f85149' : '#58a6ff'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Enhanced code animation
function initCodeAnimation() {
    const codeLines = document.querySelectorAll('.code-line');
    
    codeLines.forEach((line, index) => {
        // Add random width variations
        const randomWidth = Math.random() * 0.4 + 0.4; // 40% to 80%
        line.style.width = `${randomWidth * 100}%`;
        
        // Add random animation delays
        line.style.animationDelay = `${index * 0.3}s`;
    });
}

function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const cursor = heroTitle.querySelector('.cursor');
    if (!cursor) return;

    const originalHTML = heroTitle.innerHTML.replace(cursor.outerHTML, '').trim();
    
    // Clear content but keep cursor element
    heroTitle.innerHTML = '';
    heroTitle.appendChild(cursor);

    let index = 0;
    const typingSpeed = 25;

    const typeNextChar = () => {
        if (index < originalHTML.length) {
            // handle HTML tags safely
            if (originalHTML[index] === '<') {
                const tagEnd = originalHTML.indexOf('>', index);
                if (tagEnd !== -1) {
                    // insert tag immediately without delay
                    const tagContent = originalHTML.substring(index, tagEnd + 1);
                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = tagContent;
                    // Insert the parsed content before cursor
                    while (tempDiv.firstChild) {
                        heroTitle.insertBefore(tempDiv.firstChild, cursor);
                    }
                    index = tagEnd + 1; // move past tag
                    // immediately call next character, no setTimeout
                    typeNextChar(); 
                    return;
                }
            } else {
                // Add character before cursor
                const textNode = document.createTextNode(originalHTML[index++]);
                heroTitle.insertBefore(textNode, cursor);
            }
            setTimeout(typeNextChar, typingSpeed);
        } else {
            // typing done → start blinking
            cursor.classList.add('blink');
        }
    };

    setTimeout(typeNextChar, 500);
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const codeAnimation = document.querySelector('.code-animation');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (codeAnimation) {
            codeAnimation.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Initialize parallax
initParallaxEffect();

// Skill items hover effect
function initSkillHoverEffect() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize skill hover effects
initSkillHoverEffect();

// Project card interactions
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project interactions
initProjectInteractions();

// Button click animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize button animations
initButtonAnimations();

// Theme toggle (bonus feature)
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        // This is a placeholder for theme switching
        // In a real implementation, you'd switch between light and dark themes
        showNotification('Theme toggle coming soon!', 'info');
    });
}

// Initialize theme toggle
initThemeToggle();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Console welcome message
console.log(`
🚀 Portfolio Website Loaded Successfully!

Built with:
- HTML5 & CSS3
- Vanilla JavaScript
- Vibrant Design
- Responsive Design
- Formspree Integration

Features:
- Smooth scrolling navigation
- Interactive animations
- Form validation with Formspree
- Notification system
- Parallax effects
- Mobile responsive

Enjoy exploring! 🎉
`);

// Debug: Check if DOM is loaded properly
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded successfully');
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        console.log('Hero title found:', heroTitle.textContent);
    } else {
        console.error('Hero title not found!');
    }
});
