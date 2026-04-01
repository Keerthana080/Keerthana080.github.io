/* ============================================================
   PORTFOLIO — script.js
   Handles: navbar, theme toggle, typing effect, scroll reveal,
            skill bars, counter animation, contact form, back-to-top
   ============================================================ */

/* ── 1. DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initTypingEffect();
  initScrollReveal();
  initScrollSpy();
  initSkillBars();
  initCounters();
  initContactForm();
  initBackToTop();
  initHamburger();
});

/* ────────────────────────────────────────
   NAVBAR — sticky + scrolled class
──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ────────────────────────────────────────
   HAMBURGER MENU (mobile)
──────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ────────────────────────────────────────
   DARK / LIGHT THEME TOGGLE
──────────────────────────────────────── */
function initThemeToggle() {
  const toggle    = document.getElementById('themeToggle');
  const icon      = document.getElementById('themeIcon');
  const htmlEl    = document.documentElement;
  if (!toggle) return;

  // Persist preference
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }
}

/* ────────────────────────────────────────
   TYPING EFFECT — Hero tagline
   ✏️ Edit the `roles` array to update what gets typed
──────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // ✏️ Add/remove roles here
  const roles = [
    'AI integrated apps.',
    'Cyber Security.',
    'elegant solutions.',
    'open-source tools.',
    'fast APIs.',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END     = 1800;  // ms to wait at end of word
  const PAUSE_START   = 300;   // ms before starting to delete

  function tick() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      // Type forward
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        // Finished typing — pause then delete
        if (!isPaused) {
          isPaused = true;
          setTimeout(() => { isPaused = false; isDeleting = true; tick(); }, PAUSE_END);
          return;
        }
      }
    } else {
      // Delete backward
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(tick, 800); // initial delay
}

/* ────────────────────────────────────────
   SCROLL REVEAL — animate elements on scroll
──────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal (one-time animation)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────
   SCROLL SPY — highlight active nav link
──────────────────────────────────────── */
function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ────────────────────────────────────────
   SKILL BARS — animate progress on scroll
──────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        // Small timeout for visual impact
        setTimeout(() => {
          bar.style.width = `${width}%`;
        }, 150);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ────────────────────────────────────────
   COUNTER ANIMATION — hero stats
──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1400;
      const stepTime = 16;
      const steps  = duration / stepTime;
      let current  = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, stepTime);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ────────────────────────────────────────
   CONTACT FORM
   ✏️ To make it functional:
      Option A — Formspree: change action attr to your Formspree URL
      Option B — EmailJS: follow emailjs.com docs and update below
──────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const original  = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    try {
      // ✏️ Replace the URL below with YOUR Formspree URL
      const res = await fetch('https://formspree.io/f/maqlblwk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });

      if (res.ok) {
        // ✅ Success
        status.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        status.style.color = 'var(--green)';
        form.reset();
      } else {
        // ❌ Formspree returned an error
        status.textContent = '✗ Something went wrong. Please email me directly.';
        status.style.color = 'var(--red)';
      }
    } catch (err) {
      // ❌ Network error
      status.textContent = '✗ Network error. Please try again.';
      status.style.color = 'var(--red)';
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = original;

    setTimeout(() => {
      if (status) status.textContent = '';
    }, 6000);
  });
}

/* utility */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ────────────────────────────────────────
   BACK TO TOP BUTTON
──────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
