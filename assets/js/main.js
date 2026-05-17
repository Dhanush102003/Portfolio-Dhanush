/*=============== NAME LETTER ANIMATION ===============*/
const nameEl = document.querySelector('.home__name');
if (nameEl) {
  // Split by <br> tag, wrap each letter in animated span
  const parts = nameEl.innerHTML.split(/<br\s*\/?>/i);
  let delay = 0;
  const animatedParts = parts.map((part, index) => {
    const letters = part.trim().split('').map(ch => {
      if (ch === ' ') return '&nbsp;';
      const span = `<span class="letter" style="animation-delay:${delay * 0.07}s">${ch}</span>`;
      delay++;
      return span;
    }).join('');
    return `<span class="name-line name-line-${index + 1}">${letters}</span>`;
  });
  nameEl.innerHTML = animatedParts.join('<br>');
}

/*=============== TYPING ANIMATION ===============*/
const roleEl = document.getElementById('roleText');
const roles = ['Engineer', '& Developer', 'Entrepreneur', 'CAD Specialist', 'Problem Solver'];
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeRole() {
  const current = roles[roleIdx];
  if (!roleEl) return;
  if (isDeleting) {
    roleEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    roleEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    speed = 400;
  }
  setTimeout(typeRole, speed);
}
typeRole();

/*=============== PARTICLES BACKGROUND ===============*/
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = 255 + Math.random() * 30 - 15; // purple range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w) this.speedX *= -1;
      if (this.y < 0 || this.y > h) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, 64%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(255, 50%, 60%, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  fx += (mx - fx) * 0.08;
  fy += (my - fy) * 0.08;
  if (cursor) cursor.style.left = cx + 'px';
  if (cursor) cursor.style.top = cy + 'px';
  if (follower) follower.style.left = fx + 'px';
  if (follower) follower.style.top = fy + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .projects__card, .services__header').forEach(el => {
  el.addEventListener('mouseenter', () => follower && follower.classList.add('active'));
  el.addEventListener('mouseleave', () => follower && follower.classList.remove('active'));
});

/*=============== MOBILE NAV ===============*/
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
document.querySelectorAll('.nav__link').forEach(l =>
  l.addEventListener('click', () => navMenu.classList.remove('show-menu'))
);

/*=============== SCROLL HEADER ===============*/
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scroll-header', window.scrollY >= 50);
});

/*=============== ACTIVE LINK ON SCROLL ===============*/
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector('.nav__link[href*="' + id + '"]');
    if (link) {
      link.classList.toggle('active-link', sy > top && sy <= top + h);
    }
  });
});

/*=============== WORK TABS ===============*/
document.querySelectorAll('.work__button').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.work__button').forEach(b => b.classList.remove('active-tab'));
    document.querySelectorAll('.work__content').forEach(c => c.classList.remove('active-content'));
    btn.classList.add('active-tab');
    document.getElementById(tab).classList.add('active-content');
  });
});

const eduBtn = document.getElementById('educationBtn');
if (eduBtn) {
  eduBtn.addEventListener('click', () => {
    const eduTabBtn = document.querySelector('.work__button[data-tab="education"]');
    if (eduTabBtn) eduTabBtn.click();
  });
}

/*=============== SERVICES ACCORDION ===============*/
document.querySelectorAll('.services__header').forEach(hdr => {
  hdr.addEventListener('click', () => {
    const card = hdr.parentElement;
    document.querySelectorAll('.services__card').forEach(c => {
      if (c !== card) c.classList.remove('active');
    });
    card.classList.toggle('active');
  });
});
const firstService = document.querySelector('.services__card');
if (firstService) firstService.classList.add('active');

/*=============== COPY EMAIL ===============*/
const copyBtn = document.getElementById('copyEmail');
const copiedMsg = document.getElementById('copiedMsg');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('dhanush.b1102003@gmail.com').then(() => {
      copiedMsg.classList.add('show');
      copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
      setTimeout(() => {
        copiedMsg.classList.remove('show');
        copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copy email';
      }, 2500);
    });
  });
}

/*=============== SCROLL REVEAL ===============*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top', distance: '60px',
    duration: 1400, delay: 200, reset: false,
  });
  sr.reveal('.home__greeting', { delay: 200 });
  sr.reveal('.home__name', { delay: 300, origin: 'left' });
  sr.reveal('.home__image', { delay: 500, origin: 'bottom', distance: '80px' });
  sr.reveal('.home__split', { delay: 400, origin: 'right' });
  sr.reveal('.home__profession', { delay: 600, origin: 'right' });
  sr.reveal('.home__social', { delay: 800, origin: 'left' });
  sr.reveal('.home__cv', { delay: 800, origin: 'right' });
  sr.reveal('.about__data', { origin: 'left' });
  sr.reveal('.about__image', { origin: 'right', delay: 300 });
  sr.reveal('.section__title');
  sr.reveal('.projects__wrapper', { origin: 'bottom' });
  sr.reveal('.work__tabs', { origin: 'bottom' });
  sr.reveal('.work__data', { interval: 150, origin: 'bottom' });
  sr.reveal('.services__card', { interval: 200, origin: 'bottom' });
  sr.reveal('.certifications__container', { origin: 'bottom' });
  sr.reveal('.contact__description', { origin: 'top' });
  sr.reveal('.contact__copy', { origin: 'bottom', delay: 300 });
  sr.reveal('.contact__card', { interval: 150, origin: 'bottom' });
  sr.reveal('.footer', { origin: 'bottom' });
}

/*=============== PARALLAX SHAPES ===============*/
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.home__shape').forEach((s, i) => {
    s.style.transform = `translateY(${sy * (i + 1) * 0.04}px)`;
  });
});
