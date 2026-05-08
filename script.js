document.addEventListener('DOMContentLoaded', () => {
    // Intro animation sequence
    const introAnimation = document.getElementById('intro-animation');
    if (introAnimation) {
        const introTexts = document.querySelectorAll('.intro-text');
        const introInfinity = document.querySelector('.intro-infinity');

        // Prevent scrolling during animation
        document.body.style.overflow = 'hidden';

        // Reveal text after infinity draws
        setTimeout(() => {
            introTexts.forEach(t => t.classList.add('reveal'));
            introInfinity.classList.add('shrink');
        }, 1500);

        // Fade out overlay
        setTimeout(() => {
            introAnimation.classList.add('fade-out');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Remove from DOM after fade transition
            setTimeout(() => {
                introAnimation.remove();
            }, 1000);
        }, 3500);
    }
});

// Hover effect for service cards
const cards = document.querySelectorAll('.service-card');

document.getElementById('cards').onmousemove = e => {
    for(const card of cards) {
        const rect = card.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
};

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-up').forEach((el) => {
    observer.observe(el);
});

// Select styling fix
const select = document.getElementById('service');
select.addEventListener('change', function() {
    if(this.value) {
        this.style.color = '#fff';
    }
});

// Form submission mock
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.style.opacity = '0.7';
    
    setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        btn.style.color = '#fff';
        btn.style.opacity = '1';
        form.reset();
        select.style.color = 'var(--text-muted)';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 3000);
    }, 1500);
});

// Branding Marquee Highlight Logic
const brandingMarquee = document.querySelector('.branding-marquee');
if (brandingMarquee) {
    const staticText = document.getElementById('branding-static');
    const track = document.querySelector('.b-track');
    const terms = document.querySelectorAll('.b-term');
    
    let isPaused = false;
    let prevClosestText = null;
    let prevSignedDist = Infinity;

    function updateMarqueeHighlights() {
        if (!staticText) return;
        
        const targetLeft = staticText.getBoundingClientRect().left;
        let closestTerm = null;
        let minDistance = Infinity;
        let closestSignedDist = Infinity;

        terms.forEach(term => {
            const rect = term.getBoundingClientRect();
            const signedDist = rect.left - targetLeft;
            const dist = Math.abs(signedDist);
            
            if (dist < minDistance) {
                minDistance = dist;
                closestTerm = term;
                closestSignedDist = signedDist;
            }
        });

        if (closestTerm) {
            const activeText = closestTerm.innerText;
            
            terms.forEach(term => {
                if (term.innerText === activeText) {
                    term.classList.add('m-highlight');
                } else {
                    term.classList.remove('m-highlight');
                }
            });

            if (activeText !== prevClosestText) {
                // Tracking a new word, reset the previous distance to Infinity
                // so it must cross the 0 threshold to trigger a pause.
                prevSignedDist = Infinity;
            }

            // It crosses the threshold when it goes from a positive distance to <= 0.
            if (prevSignedDist > 0 && closestSignedDist <= 0 && !isPaused) {
                isPaused = true;
                track.style.animationPlayState = 'paused';
                setTimeout(() => {
                    track.style.animationPlayState = 'running';
                    isPaused = false;
                }, 800); // 800ms pause
            }

            prevClosestText = activeText;
            prevSignedDist = closestSignedDist;
        }

        requestAnimationFrame(updateMarqueeHighlights);
    }

    requestAnimationFrame(updateMarqueeHighlights);
}
