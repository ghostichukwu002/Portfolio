// Header state, scroll progress, mobile menu, reveals, active nav,
// showcase tabs, stat counters and the contact form.

const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    })
  );
}

// Header border and scroll progress
function onScroll() {
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal headings and key blocks once, as they enter the viewport
const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

// Highlight the nav link for the section in view
if (nav) {
  const links = new Map();
  nav.querySelectorAll('a').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && links.has(entry.target.id)) {
          links.forEach((a) => a.classList.remove('active'));
          links.get(entry.target.id).classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  ['about', 'showcase', 'creative', 'services', 'contact'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// Showcase tabs (click and arrow keys)
const tabs = [...document.querySelectorAll('.tab')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
  });
  tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next);
  });
});

// Count-up stats, run once when visible
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion || !Number.isFinite(target)) return;
  const duration = 1200;
  const start = performance.now();
  el.textContent = '0';
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const counters = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counters.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => counters.observe(el));

// Contact form: opens an email draft to the address on the page
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = `Project enquiry: ${data.get('type')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Type: ${data.get('type')}`,
      '',
      data.get('message'),
    ].join('\n');
    window.location.href =
      `mailto:okaforanointing37@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}


// Header name rotation: OKAFOR → ANOINTING → IFEBUCHE
const nameRotator = document.querySelector('[data-name-rotator]');
if (nameRotator && !reduceMotion) {
  const names = ['OKAFOR', 'ANOINTING', 'IFEBUCHE'];
  let nameIndex = 0;
  window.setInterval(() => {
    nameRotator.classList.add('is-changing');
    window.setTimeout(() => {
      nameIndex = (nameIndex + 1) % names.length;
      nameRotator.textContent = names[nameIndex];
      nameRotator.classList.remove('is-changing');
    }, 280);
  }, 2200);
}


// Gentle pointer tilt for the dimensional intro mark (desktop only).
const introMark = document.querySelector('[data-intro-mark]');
const introScene = document.querySelector('.intro-scene');
if (introMark && introScene && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  introScene.addEventListener('pointermove', (event) => {
    const bounds = introScene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    introMark.style.setProperty('--intro-tilt-y', (x * 12).toFixed(2) + 'deg');
    introMark.style.setProperty('--intro-tilt-x', (-y * 10).toFixed(2) + 'deg');
  });
  introScene.addEventListener('pointerleave', () => {
    introMark.style.setProperty('--intro-tilt-y', '0deg');
    introMark.style.setProperty('--intro-tilt-x', '0deg');
  });
}


// Main-page entrance choreography starts as the intro curtain clears.
const introCurtain = document.querySelector('.intro');
const enterMainPage = () => document.body.classList.add('page-entered');
if (introCurtain && !reduceMotion) {
  introCurtain.addEventListener('animationend', (event) => {
    if (event.animationName === 'introCurtainOut') enterMainPage();
  }, { once: true });
  // Fallback in case the browser skips animation events.
  window.setTimeout(enterMainPage, 2300);
} else {
  window.setTimeout(enterMainPage, reduceMotion ? 100 : 0);
}
