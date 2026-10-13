const progress=document.querySelector('.progress');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
toggle?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(scrollY/Math.max(h,1)*100)+'%';
});
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
}));
/* =========================
   SMART SKILLS CHART
========================= */

const skillItems = document.querySelectorAll(".skill-item");

const skillsObserver = new IntersectionObserver(
  (entries, observer) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        const item = entry.target;
        const progress = item.querySelector(".skill-progress");

        item.classList.add("visible");

        setTimeout(() => {
          progress.style.width = progress.dataset.width;
        }, 150);

        observer.unobserve(item);
      }

    });

  },
  {
    threshold: 0.25
  }
);

skillItems.forEach((item) => {
  skillsObserver.observe(item);
});