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

/* ── Contact Form — Formspree Integration ──────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = document.getElementById('f-name')?.value.trim();
    const email = document.getElementById('f-email')?.value.trim();
    const errorBox = document.getElementById('form-error');
    const btn   = document.getElementById('submit-btn');

    // Client-side validation
    if (!name || !email) {
      if (errorBox) {
        errorBox.textContent = 'Please enter your name and email address.';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Hide previous errors, disable button
    if (errorBox) errorBox.style.display = 'none';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    try {
      const data = new FormData(form);
      const response = await fetch('https://formspree.io/f/xqeybnjv', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Show success state
        const fields  = document.getElementById('form-fields');
        const success = document.getElementById('form-success');
        if (fields)  fields.style.display  = 'none';
        if (success) success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Show server error message from Formspree
        const json = await response.json().catch(() => ({}));
        const msg  = (json.errors || []).map(err => err.message).join(' ') ||
                     'Something went wrong. Please try again or email us directly.';
        if (errorBox) {
          errorBox.textContent = msg;
          errorBox.style.display = 'block';
        }
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '📅 Book My Free 30-Min Audit';
        }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = 'Network error — please check your connection and try again.';
        errorBox.style.display = 'block';
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '📅 Book My Free 30-Min Audit';
      }
    }
  });
});

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
