// anim.js — cursor, scroll progress, reveals, splits, magnetic buttons, tilt
(() => {
  // ---- Custom cursor (instant, zero delay) ----
  const ring = document.getElementById('ring');
  const dot = document.getElementById('dot');
  addEventListener('mousemove', (e) => {
    const x = e.clientX, y = e.clientY;
    if (dot)  dot.style.transform  = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    if (ring) ring.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('a, button, .magnetic, .js-tilt, .tag, .sticker, .email')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('hot'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('hot'));
    });

  // ---- Scroll progress bar ----
  const progress = document.getElementById('progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, (h.scrollHeight - h.clientHeight));
    if (progress) progress.style.width = (p * 100) + '%';
  }, { passive: true });

  // ---- Reveal on scroll (lightweight; only sets class, doesn't hide) ----
  // (Old IntersectionObserver removed — was hiding content when GSAP cleaned up inline styles.)

  // ---- GSAP enhancements ----
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // split hero headings into spans (per char) for stagger
    document.querySelectorAll('.js-split').forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'split-char';
        s.textContent = c === ' ' ? '\u00A0' : c;
        el.appendChild(s);
      });
    });

    gsap.fromTo('.h-display .split-char',
      { yPercent: 100, opacity: 0, rotate: 8 },
      { yPercent: 0, opacity: 1, rotate: 0,
        duration: 0.9, ease: 'back.out(2)', stagger: 0.03, delay: 0.1,
        immediateRender: false,
      }
    );

    gsap.from('.lede, .hero-actions, .sticker', {
      y: 30, opacity: 0, duration: .9, ease: 'power3.out',
      stagger: 0.08, delay: 0.55,
    });

    gsap.from('.portrait-card', {
      x: 60, opacity: 0, rotate: 10, duration: 1.1, ease: 'power3.out', delay: 0.3,
    });

    // floating animation on portrait card
    gsap.to('.portrait-card', {
      y: '+=10', rotate: '-=2', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    // project cards — stagger reveal + subtle pop
    gsap.utils.toArray('.proj').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0, scale: .94, rotate: i % 2 ? 1.4 : -1.4 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: .8, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none none' }
        }
      );
    });

    // skills tags pop on enter
    gsap.utils.toArray('.skill-group').forEach((g) => {
      gsap.fromTo(g.querySelectorAll('.tag'),
        { y: 20, opacity: 0, scale: .9, rotate: 6 },
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: .55, ease: 'back.out(2)',
          stagger: .045, immediateRender: false,
          scrollTrigger: { trigger: g, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    // timeline items
    gsap.utils.toArray('.t-item').forEach((it, i) => {
      gsap.fromTo(it,
        { x: i % 2 ? 40 : -40, opacity: 0 },
        { x: 0, opacity: 1, duration: .7, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: it, start: 'top 92%', toggleActions: 'play none none none' }
        }
      );
    });

    // big section headings
    gsap.utils.toArray('.h-section').forEach((h) => {
      gsap.fromTo(h,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: h, start: 'top 92%', toggleActions: 'play none none none' }
        }
      );
    });

    // eyebrows + ledes
    gsap.utils.toArray('section.section .eyebrow, section.section > .lede').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' }
        }
      );
    });

    // contact card
    gsap.fromTo('.contact-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.contact-card', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  }

  // ---- Magnetic buttons ----
  document.querySelectorAll('.magnetic').forEach((m) => {
    const target = m.querySelector('.btn') || m;
    m.addEventListener('mousemove', (e) => {
      const r = m.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      target.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    m.addEventListener('mouseleave', () => {
      target.style.transform = '';
    });
  });

  // ---- 3D tilt on cards ----
  document.querySelectorAll('.js-tilt').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // ---- Email copy ----
  const emailEl = document.getElementById('emailCopy');
  if (emailEl) {
    emailEl.addEventListener('click', () => {
      navigator.clipboard?.writeText('giorgosigo@gmail.com');
      const orig = emailEl.innerHTML;
      emailEl.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => { emailEl.innerHTML = orig; }, 1400);
    });
  }

  // ---- Contact form (Formspree) ----
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const origBtn = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      if (status) { status.textContent = ''; status.style.color = ''; }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          btn.textContent = 'Sent ✓';
          if (status) {
            status.style.color = '#10b981';
            status.textContent = 'Thanks! I\'ll reply within a day or two.';
          }
          setTimeout(() => { btn.textContent = origBtn; btn.disabled = false; }, 2500);
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        btn.textContent = origBtn;
        btn.disabled = false;
        if (status) {
          status.style.color = '#ff6fa3';
          status.textContent = 'Hmm, that didn\'t go through. Email me directly: giorgosigo@gmail.com';
        }
      }
    });
  }
})();
