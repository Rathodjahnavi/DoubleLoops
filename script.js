document.addEventListener('DOMContentLoaded', () => {
    // Intro animation sequence
    const introAnimation = document.getElementById('intro-animation');
    if (introAnimation) {
        const introTexts = document.querySelectorAll('.intro-text');
        const introInfinity = document.querySelector('.intro-infinity');

        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            introTexts.forEach(t => t.classList.add('reveal'));
            introInfinity.classList.add('shrink');
        }, 1500);

        setTimeout(() => {
            introAnimation.classList.add('fade-out');
            document.body.style.overflow = '';
            // Make hero visible immediately
            document.querySelectorAll('.hero .fade-in').forEach(el => el.classList.add('visible'));
            setTimeout(() => introAnimation.remove(), 1000);
        }, 3500);
    }

    // === HERO CANVAS PARTICLES ===
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, dots = [];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const N = 55;
        for (let i = 0; i < N; i++) {
            dots.push({
                x: Math.random() * 1000,
                y: Math.random() * 800,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.8 + 0.5,
                a: Math.random() * 0.5 + 0.1
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);
            // Update
            dots.forEach(d => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = W;
                if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H;
                if (d.y > H) d.y = 0;
            });
            // Connections
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(150,160,255,${0.06 * (1 - dist/120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }
            // Dots
            dots.forEach(d => {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,190,255,${d.a})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // === CUSTOM DROPDOWN ===
    const trigger  = document.getElementById('cs-trigger');
    const list     = document.getElementById('cs-list');
    const valueEl  = document.getElementById('cs-value');
    const realSel  = document.getElementById('service');

    if (trigger && list) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            trigger.classList.toggle('open');
            list.classList.toggle('open');
        });

        list.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const val = li.dataset.val;
                // Update display
                valueEl.textContent = li.textContent.replace(/^\S+\s/, ''); // strip emoji prefix for display
                valueEl.textContent = val;
                trigger.classList.add('selected');
                trigger.classList.remove('open');
                list.classList.remove('open');
                // Clear other selected
                list.querySelectorAll('li').forEach(l => l.classList.remove('selected'));
                li.classList.add('selected');
                // Sync hidden select
                if (realSel) {
                    realSel.value = val;
                    realSel.dispatchEvent(new Event('change'));
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            trigger.classList.remove('open');
            list.classList.remove('open');
        });
    }
});


// Hover effect for service cards
const cards = document.querySelectorAll('.service-card');

document.getElementById('cards').onmousemove = e => {
    for (const card of cards) {
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

// Select styling fix (keep for WhatsApp form read)
const select = document.getElementById('service');


// Form submission — WhatsApp API
const WHATSAPP_NUMBER = '919835237073'; // +91 9835237073

const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button');
    const originalHTML = btn.innerHTML;

    // Read field values
    const name    = (form.querySelector('#name')?.value    || '').trim();
    const email   = (form.querySelector('#email')?.value   || '').trim();
    const service = (form.querySelector('#service')?.value || '').trim();
    const message = (form.querySelector('#message')?.value || '').trim();

    if (!service) {
        const trigger = document.getElementById('cs-trigger');
        if (trigger) {
            trigger.style.borderColor = '#f87171';
            setTimeout(() => trigger.style.borderColor = '', 2000);
        }
        return;
    }

    const text = [
        `👋 *New Inquiry from DoubleLoops Website*`,
        ``,
        `👤 *Name:* ${name}`,
        `📧 *Email:* ${email}`,
        `🛠️ *Service:* ${service}`,
        ``,
        `📝 *Project Details:*`,
        message
    ].join('\n');

    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    btn.textContent = 'Opening WhatsApp…';
    btn.style.opacity = '0.8';

    setTimeout(() => {
        window.open(waURL, '_blank');

        btn.textContent = '✓ Sent via WhatsApp!';
        btn.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
        btn.style.color = '#fff';
        btn.style.opacity = '1';
        form.reset();

        // Reset custom dropdown
        const valueEl = document.getElementById('cs-value');
        const trigger = document.getElementById('cs-trigger');
        if (valueEl) valueEl.textContent = 'Select a Service';
        if (trigger) { trigger.classList.remove('selected'); }
        document.querySelectorAll('.cs-list li').forEach(li => li.classList.remove('selected'));

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '';
        }, 3500);
    }, 600);
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
