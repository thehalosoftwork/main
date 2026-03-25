/* ═══════════════════════════════════════════════════════════
   HaloSoft — Elite 10/10 Script
   Signature motion: cinematic scroll · parallax hero · counter anim
   ═══════════════════════════════════════════════════════════ */

// ─── SMOOTH SCROLLING ─────────────────────────────────────────────────────────
function scrollToContact() { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }
function scrollToWork()    { document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); }
function scrollToPricing() { document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' }); }

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    nav.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
}

// ─── FAQ TOGGLE ───────────────────────────────────────────────────────────────
function toggleFAQ(element) {
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== element) item.classList.remove('active');
    });
    element.classList.toggle('active');
}

// ─── HERO MOUSE PARALLAX (signature 3-layer depth) ───────────────────────────
const heroSection  = document.querySelector('.hero');
const heroContent  = document.querySelector('.hero-content');
const heroShowcase = document.querySelector('.video-showcase');
const heroOrbs     = document.querySelectorAll('.hero-orb');

let mouseX = 0, mouseY = 0, heroW = 0, heroH = 0;
function updateHeroDim() {
    if (heroSection) { heroW = heroSection.offsetWidth; heroH = heroSection.offsetHeight; }
}
updateHeroDim();
window.addEventListener('resize', updateHeroDim);

document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / (heroW || window.innerWidth) - 0.5) * 2;
    mouseY = (e.clientY / (heroH || window.innerHeight) - 0.5) * 2;
});

let cCurrX = 0, cCurrY = 0, sCurrX = 0, sCurrY = 0;

function animateParallax() {
    const cTargetX = mouseX * -9,  cTargetY = mouseY * -5;
    const sTargetX = mouseX * 15,  sTargetY = mouseY * 8;
    cCurrX += (cTargetX - cCurrX) * 0.06;
    cCurrY += (cTargetY - cCurrY) * 0.06;
    sCurrX += (sTargetX - sCurrX) * 0.04;
    sCurrY += (sTargetY - sCurrY) * 0.04;
    if (heroContent)  heroContent.style.transform  = `translate3d(${cCurrX}px,${cCurrY}px,0)`;
    if (heroShowcase) heroShowcase.style.transform = `translate3d(${sCurrX}px,${sCurrY}px,0)`;
    heroOrbs.forEach((orb, i) => {
        const f = (i + 1) * 22;
        orb.style.transform = `translate(${mouseX * f}px,${mouseY * f * 0.6}px)`;
    });
    requestAnimationFrame(animateParallax);
}
animateParallax();

// ─── CURSOR GLOW ──────────────────────────────────────────────────────────────
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

let glowX = 0, glowY = 0, glowCX = 0, glowCY = 0;
document.addEventListener('mousemove', e => { glowX = e.clientX; glowY = e.clientY; });
function animateGlow() {
    glowCX += (glowX - glowCX) * 0.1;
    glowCY += (glowY - glowCY) * 0.1;
    glow.style.left = glowCX + 'px';
    glow.style.top  = glowCY + 'px';
    requestAnimationFrame(animateGlow);
}
animateGlow();
if ('ontouchstart' in window) glow.style.display = 'none';

// ─── NAV SCROLL STATE ─────────────────────────────────────────────────────────
const navEl = document.querySelector('nav');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navEl.classList.toggle('scrolled', y > 80);
    navEl.classList.toggle('hidden', y > lastScrollY && y > 320);
    lastScrollY = y;
}, { passive: true });

// ─── CINEMATIC SCROLL FADE-UP ─────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.querySelectorAll('.fade-up'));
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('visible'), idx * 90);
        revealObs.unobserve(el);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(2, -10 * t);
        const val = isFloat ? (ease * target).toFixed(1) : Math.round(ease * target);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
const cntObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCounter(el, parseFloat(el.dataset.count), el.dataset.suffix || '');
        cntObs.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x * 0.28}px,${y * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ─── CARD TILT ────────────────────────────────────────────────────────────────
function applyTilt(sel, intensity) {
    document.querySelectorAll(sel).forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            card.style.transition = 'transform 0.08s linear';
            card.style.transform  = `perspective(900px) rotateX(${-dy * intensity}deg) rotateY(${dx * intensity}deg) translateZ(8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
            card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}
applyTilt('.service-card',    7);
applyTilt('.testimonial-card',5);
applyTilt('.info-item',       5);
applyTilt('.pricing-card',    4);

// ─── EXPANDABLE PROJECT CARDS ─────────────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('.project-link')) return;
        const was = card.classList.contains('expanded');
        document.querySelectorAll('.project-card.expanded').forEach(c => c.classList.remove('expanded'));
        if (!was) card.classList.add('expanded');
    });
});

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ─── HERO TEXT SCRAMBLE ───────────────────────────────────────────────────────
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#░▒';
        this.update = this.update.bind(this);
    }
    setText(text) {
        const old = this.el.innerText;
        const len = Math.max(old.length, text.length);
        const promise = new Promise(r => this.resolve = r);
        this.queue = Array.from({ length: len }, (_, i) => ({
            from:  old[i] || '',
            to:    text[i] || '',
            start: Math.floor(Math.random() * 14),
            end:   Math.floor(Math.random() * 14) + 14,
            char:  ''
        }));
        cancelAnimationFrame(this.raf);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let out = '', done = 0;
        for (const q of this.queue) {
            if (this.frame >= q.end) { out += q.to; done++; }
            else if (this.frame >= q.start) {
                if (!q.char || Math.random() < 0.28)
                    q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
                out += `<span class="scramble-char">${q.char}</span>`;
            } else { out += q.from; }
        }
        this.el.innerHTML = out;
        if (done === this.queue.length) { this.resolve(); }
        else { this.raf = requestAnimationFrame(this.update); this.frame++; }
    }
}

const heroSub = document.querySelector('.hero-sub-rotate');
if (heroSub) {
    const phrases = [
        'Websites, apps & digital systems that turn visitors into customers.',
        'Agency-quality products at startup-friendly prices.',
        'From idea to revenue-generating reality in weeks.',
        'Built by developers who care about outcomes, not just deliverables.'
    ];
    const sc = new TextScramble(heroSub);
    let idx = 0;
    const next = () => {
        sc.setText(phrases[idx]).then(() => setTimeout(next, 3800));
        idx = (idx + 1) % phrases.length;
    };
    setTimeout(next, 1200);
}

// ─── ACTIVE NAV LINK ON SCROLL ────────────────────────────────────────────────
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.id;
            allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
    });
}, { threshold: 0.45 });
allSections.forEach(s => secObs.observe(s));

// ─── PROCESS LINE ANIMATE ─────────────────────────────────────────────────────
const procSec = document.querySelector('.process-section');
if (procSec) {
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { procSec.classList.add('line-animate'); }
    }, { threshold: 0.3 }).observe(procSec);
}

// ─── HOVER SOUND PULSE ON CARDS (visual only — ring effect) ──────────────────
document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const ring = document.createElement('div');
        ring.className = 'hover-ring';
        card.appendChild(ring);
        setTimeout(() => ring.remove(), 600);
    });
});
// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function handleNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'linear-gradient(135deg,#25D366,#128C7E)';
    input.value = '';
    input.disabled = true;
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = 'Subscribe →';
        btn.style.background = '';
        input.disabled = false;
        btn.disabled = false;
    }, 3000);
}

// ─── LIGHT / DARK MODE TOGGLE ─────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('halosoft-theme') || 'dark';
if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('halosoft-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('halosoft-theme', 'light');
    }
});