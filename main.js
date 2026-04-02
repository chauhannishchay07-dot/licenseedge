/* ═══════════════════════════════════════════════════════════
   LICENSEEDGE — Shared JavaScript
═══════════════════════════════════════════════════════════ */

/* ── Nav scroll effect ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);

  const st = document.getElementById('scroll-top');
  if (st) st.classList.toggle('show', window.scrollY > 400);
});

/* ── Active nav link ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});

/* ── Mobile menu ───────────────────────────────────────── */
function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  const h = document.querySelector('.hamburger');
  if (!m || !h) return;
  m.classList.toggle('open');
  h.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  const m = document.getElementById('mobileMenu');
  const h = document.querySelector('.hamburger');
  if (m) m.classList.remove('open');
  if (h) h.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close menu on outside click */
document.addEventListener('click', e => {
  const m = document.getElementById('mobileMenu');
  const nav = document.getElementById('nav');
  if (m && m.classList.contains('open') && !nav.contains(e.target) && !m.contains(e.target)) {
    closeMenu();
  }
});

/* ── FAQ Accordion ─────────────────────────────────────── */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Contact Form ──────────────────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  const name  = document.getElementById('f-name')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();
  if (!name || !email) {
    alert('Please enter your name and email address.');
    return;
  }
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'none';
  if (success) success.style.display = 'block';
}

/* ── Scroll Animations (IntersectionObserver) ──────────── */
document.addEventListener('DOMContentLoaded', () => {
  const selectors = '.reveal, .reveal-left, .reveal-right';
  const els = document.querySelectorAll(selectors);

  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
});

/* ── Smooth anchor scroll (offset for nav) ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

/* ── Scroll-to-top button ──────────────────────────────── */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Typed/counter animation for big stat numbers ──────── */
function animateCounter(el, target, prefix = '', suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.floor(ease * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, prefix, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
});
