// Header state, scroll progress, mobile menu, reveals and active nav link.

const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');

// Mobile menu
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

// Header border and scroll progress
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  header.classList.toggle('scrolled', window.scrollY > 10);
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
['about', 'services', 'projects', 'contact'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});
