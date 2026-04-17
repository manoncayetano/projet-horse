/* ============================================
   ÉQUIMARCHÉ — main.js
   Interactions & micro-animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll shadow ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // --- Smooth reveal on scroll (Intersection Observer) ---
  const revealEls = document.querySelectorAll(
    '.horse-card, .step-card, .testimonial-card, .stat-card, .tips-card, .activity-item, .fav-card, .vet-card'
  );

  if (revealEls.length > 0) {
    // Set initial state
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 60 * (Array.from(revealEls).indexOf(entry.target) % 6));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // --- Mobile nav toggle ---
  const navContainer = document.querySelector('.nav-container');
  if (navContainer && !navContainer.querySelector('.mobile-menu-btn')) {
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'mobile-menu-btn';
    mobileBtn.setAttribute('aria-label', 'Menu');
    mobileBtn.innerHTML = '<span class="material-icons">menu</span>';
    mobileBtn.style.cssText = `
      display: none; background: none; border: none; cursor: pointer;
      color: var(--on-surface); margin-left: auto;
    `;
    navContainer.appendChild(mobileBtn);

    // Show on mobile
    const checkMobile = () => {
      mobileBtn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Toggle nav links
    const navLinks = navContainer.querySelector('.nav-links');
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks && navLinks.style.display === 'flex';
      if (navLinks) {
        navLinks.style.display = isOpen ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = 'var(--nav-h)';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--surface)';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = 'var(--shadow-float)';
        navLinks.style.zIndex = '99';
      }
      mobileBtn.innerHTML = isOpen
        ? '<span class="material-icons">menu</span>'
        : '<span class="material-icons">close</span>';
    });
  }

  // --- Hero parallax (subtle) ---
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.08}px)`;
    }, { passive: true });
  }

  // --- Catalogue filter apply button feedback ---
  const applyBtn = document.getElementById('apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyBtn.textContent = '✓ Filtres appliqués';
      applyBtn.style.background = '#4caf50';
      setTimeout(() => {
        applyBtn.textContent = 'Appliquer les filtres';
        applyBtn.style.background = '';
      }, 1500);
    });
  }

  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-input, .filter-select').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      document.querySelectorAll('.filter-check input').forEach(cb => cb.checked = false);
    });
  }

  // --- Catalogue card click ---
  document.querySelectorAll('.horse-card[data-href]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        window.location.href = card.dataset.href;
      }
    });
  });

  // --- Dashboard sidebar smooth scroll ---
  document.querySelectorAll('.dash-nav-item[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Page loading fade in ---
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // --- Number counter animation for stats ---
  const statNums = document.querySelectorAll('.stat-card__num');
  if (statNums.length > 0) {
    const animateNumber = (el) => {
      const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      if (isNaN(target)) return;
      const suffix = el.textContent.replace(/[0-9.]/g, '').trim();
      let current = 0;
      const duration = 1200;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1))
          .toLocaleString('fr-FR') + (suffix ? ' ' + suffix : '');
        if (current >= target) clearInterval(timer);
      }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => statsObserver.observe(el));
  }

  // --- Sticky contact bar for detail page ---
  const detailCtaBlock = document.querySelector('.detail-cta-block');
  if (detailCtaBlock && window.innerWidth > 768) {
    const stickyBar = document.createElement('div');
    stickyBar.id = 'stickyContactBar';
    stickyBar.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
      background: rgba(251,251,226,0.95); backdrop-filter: blur(20px);
      border-top: 1px solid rgba(195,200,193,0.3);
      padding: 1rem 2rem; display: flex; align-items: center;
      justify-content: space-between;
      transform: translateY(100%); transition: transform 0.35s ease;
      box-shadow: 0 -8px 40px rgba(27,29,14,0.06);
    `;
    stickyBar.innerHTML = `
      <div>
        <strong style="font-family:var(--font-serif);font-size:1.1rem;">Caspian Blue</strong>
        <span style="color:var(--secondary);font-weight:700;font-size:1rem;margin-left:1rem;">15 500 €</span>
      </div>
      <div style="display:flex;gap:0.75rem;">
        <a href="#contact-form" style="background:linear-gradient(135deg,var(--primary),var(--primary-container));color:#fff;padding:0.65rem 1.5rem;border-radius:var(--radius-md);font-weight:600;font-size:0.9rem;text-decoration:none;">Contacter le vendeur</a>
      </div>
    `;
    document.body.appendChild(stickyBar);

    window.addEventListener('scroll', () => {
      const detailTop = detailCtaBlock.getBoundingClientRect().bottom;
      if (detailTop < 0) {
        stickyBar.style.transform = 'translateY(0)';
      } else {
        stickyBar.style.transform = 'translateY(100%)';
      }
    }, { passive: true });
  }

  // --- Form input floating label effect ---
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('focus', () => {
      const label = input.previousElementSibling;
      if (label && label.classList.contains('form-label')) {
        label.style.color = 'var(--secondary)';
      }
    });
    input.addEventListener('blur', () => {
      const label = input.previousElementSibling;
      if (label && label.classList.contains('form-label')) {
        label.style.color = '';
      }
    });
  });

  console.log('%c🐎 ÉquiMarché — The Digital Curator', 'color:#1b3022;font-size:14px;font-weight:bold;');
});
