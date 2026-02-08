/* ============================================
   MORENO & SON LANDSCAPING — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- DYNAMIC COPYRIGHT YEAR ---------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- PHONE OBFUSCATION ---------- */
  const phoneLinks = document.querySelectorAll('.phone-link');
  phoneLinks.forEach(link => {
    const p1 = link.dataset.p1;
    const p2 = link.dataset.p2;
    const p3 = link.dataset.p3;
    const fullNumber = `(${p1}) ${p2}-${p3}`;
    const telLink = `tel:${p1}${p2}${p3}`;

    // On mobile, show the number immediately
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      link.textContent = fullNumber;
      link.href = telLink;
    } else {
      // On desktop, reveal on click
      link.addEventListener('click', (e) => {
        e.preventDefault();
        link.textContent = fullNumber;
        link.href = telLink;
      });
    }
  });

  /* ---------- HEADER SCROLL EFFECT ---------- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- MOBILE NAVIGATION ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  let overlay = null;

  // Create overlay element
  const createOverlay = () => {
    overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    overlay.addEventListener('click', closeNav);
  };

  const openNav = () => {
    nav.classList.add('active');
    menuToggle.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuToggle && nav) {
    createOverlay();

    menuToggle.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close nav when a link is clicked
    const navLinks = nav.querySelectorAll('.header__nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Close nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
      closeNav();
    }
  });

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- SCROLL-TRIGGERED FADE-IN ANIMATIONS ---------- */
  const fadeElements = document.querySelectorAll(
    '.service-card, .why-us__item, .review-card, .about-preview__wrapper, ' +
    '.contact__wrapper, .services-section__grid, .about-story__wrapper, ' +
    '.about-values__item, .about-quote__block, .about-team__wrapper, ' +
    '.gallery__item, .services-intro'
  );

  // Add the fade-in class to all target elements
  fadeElements.forEach(el => {
    el.classList.add('fade-in');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for grid items
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(child =>
            child.classList.contains('fade-in')
          );
          const index = siblings.indexOf(entry.target);
          if (index > 0) {
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }
        }

        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  /* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.header__nav-link');

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href').split('#')[0];
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };

  // Only run if not already set by HTML
  if (!document.querySelector('.header__nav-link.active')) {
    setActiveNavLink();
  }

  /* ---------- FORM SUBMISSION FEEDBACK ---------- */
  const form = document.querySelector('.contact__form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          submitBtn.textContent = 'Message Sent ✓';
          submitBtn.style.backgroundColor = 'var(--color-medium)';
          submitBtn.style.color = 'var(--color-white)';
          form.reset();

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        submitBtn.textContent = 'Error — Try Again';
        submitBtn.style.backgroundColor = '#c0392b';
        submitBtn.style.color = '#fff';
        submitBtn.disabled = false;

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }
    });
  }

});
