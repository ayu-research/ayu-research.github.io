/**
 * Dr. Ayu Lestari Academic Portfolio - Interactive Scripts
 * Features: Floating Daisy Canvas, Filter & Search, Modals, Stats Counter, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initDaisyPetalsCanvas();
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initPublicationFilters();
  initModals();
  initContactForm();
  initBackToTop();
  initCopyAcademicIds();
});

/* ==========================================================================
   1. Floating Daisy Petals Canvas Particle System
   ========================================================================== */
function initDaisyPetalsCanvas() {
  const canvas = document.getElementById('daisyCanvas');
  const toggleBtn = document.getElementById('petalsToggleBtn');
  const toggleIcon = document.getElementById('petalsToggleIcon');
  const toggleText = document.getElementById('petalsToggleText');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let isEnabled = localStorage.getItem('daisyPetalsEnabled') !== 'false'; // default true
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 16 : 28;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class DaisyPetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = Math.random() * 8 + 8; // 8 to 16px
      this.speedY = Math.random() * 0.9 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.025;
      this.swingPeriod = Math.random() * 80 + 60;
      this.swingStep = Math.random() * 100;
      this.opacity = Math.random() * 0.4 + 0.5;
      this.type = Math.random() > 0.4 ? 'petal' : 'miniFlower';
    }

    update() {
      this.swingStep++;
      this.x += this.speedX + Math.sin(this.swingStep / 20) * 0.7;
      this.y += this.speedY;
      this.angle += this.angularSpeed;

      if (this.y > canvas.height + 25 || this.x < -30 || this.x > canvas.width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Individual Daisy Petal (Soft white to blush pink)
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.45, -this.size * 0.8, this.size * 0.4, this.size * 0.6, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.4, this.size * 0.6, -this.size * 0.45, -this.size * 0.8, 0, -this.size);
        
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.7, '#FFF0F5');
        grad.addColorStop(1, '#FFCAD4');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(251, 111, 146, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        // Miniature Daisy Blossom
        const petals = 8;
        const r = this.size * 0.55;
        for (let i = 0; i < petals; i++) {
          const petalAngle = (i * Math.PI * 2) / petals;
          ctx.save();
          ctx.rotate(petalAngle);
          ctx.beginPath();
          ctx.ellipse(0, -r * 1.3, r * 0.38, r * 0.75, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(251, 111, 146, 0.25)';
          ctx.shadowBlur = 3;
          ctx.fill();
          ctx.restore();
        }
        // Center Disk
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = '#F4A261';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE066';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DaisyPetal());
  }

  function loop() {
    if (!isEnabled) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    animationId = requestAnimationFrame(loop);
  }

  function updateToggleUI() {
    if (toggleBtn) {
      if (isEnabled) {
        toggleBtn.classList.add('bg-pink-100', 'text-pink-600', 'border-pink-300');
        toggleBtn.classList.remove('bg-gray-100', 'text-gray-400');
        if (toggleIcon) toggleIcon.className = 'fa-solid fa-fan animate-spin-slow text-pink-500';
        if (toggleText) toggleText.textContent = 'Kelopak Daisy: Aktif';
      } else {
        toggleBtn.classList.remove('bg-pink-100', 'text-pink-600', 'border-pink-300');
        toggleBtn.classList.add('bg-gray-100', 'text-gray-400');
        if (toggleIcon) toggleIcon.className = 'fa-solid fa-circle-pause text-gray-400';
        if (toggleText) toggleText.textContent = 'Kelopak Daisy: Hening';
      }
    }
  }

  if (isEnabled) {
    loop();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  updateToggleUI();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isEnabled = !isEnabled;
      localStorage.setItem('daisyPetalsEnabled', isEnabled ? 'true' : 'false');
      updateToggleUI();
      if (isEnabled) {
        if (!animationId) loop();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }

  // Auto pause when tab hidden to optimize battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && isEnabled && !animationId) {
      loop();
    }
  });
}

/* ==========================================================================
   2. Responsive Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu() {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    if (menuIcon) {
      if (!isExpanded) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
      if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================================
   3. ScrollSpy & Smooth Nav Indicators
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* ==========================================================================
   4. Animated Stat Counters
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-val');
  if (!statElements.length) return;

  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target.toLocaleString('id-ID') + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current).toLocaleString('id-ID') + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('statsContainer');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. Publications Filtering & Real-time Search
   ========================================================================== */
function initPublicationFilters() {
  const tabButtons = document.querySelectorAll('.pub-tab-btn');
  const pubCards = document.querySelectorAll('.pub-item');
  const searchInput = document.getElementById('pubSearchInput');
  const countDisplay = document.getElementById('pubCountDisplay');
  const noResultEl = document.getElementById('pubNoResult');
  const resetBtn = document.getElementById('resetSearchBtn');

  if (!pubCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function filterPublications() {
    let visibleCount = 0;

    pubCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const textContent = card.textContent.toLowerCase();
      const matchesCategory = activeCategory === 'all' || category.includes(activeCategory);
      const matchesSearch = searchTerm === '' || textContent.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.classList.add('bloom-element');
        visibleCount++;
      } else {
        card.classList.add('hidden');
        card.classList.remove('bloom-element');
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Menampilkan ${visibleCount} publikasi`;
    }

    if (noResultEl) {
      if (visibleCount === 0) {
        noResultEl.classList.remove('hidden');
      } else {
        noResultEl.classList.add('hidden');
      }
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-pink-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-plum-700', 'border', 'border-pink-200');
      });
      btn.classList.add('bg-pink-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-plum-700', 'border-pink-200');

      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterPublications();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterPublications();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      activeCategory = 'all';
      tabButtons.forEach((b, idx) => {
        if (idx === 0) {
          b.classList.add('bg-pink-600', 'text-white', 'shadow-md');
          b.classList.remove('bg-white', 'text-plum-700', 'border', 'border-pink-200');
        } else {
          b.classList.remove('bg-pink-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-plum-700', 'border', 'border-pink-200');
        }
      });
      filterPublications();
    });
  }

  filterPublications();
}

/* ==========================================================================
   6. Modals (Abstract & BibTeX, CV Viewer, Gallery Lightbox)
   ========================================================================== */
function initModals() {
  // --- Abstract Modal ---
  const abstractModal = document.getElementById('abstractModal');
  const abstractTitle = document.getElementById('abstractModalTitle');
  const abstractMeta = document.getElementById('abstractModalMeta');
  const abstractText = document.getElementById('abstractModalText');
  const abstractBibtex = document.getElementById('abstractModalBibtex');
  const closeAbstractBtn = document.getElementById('closeAbstractBtn');
  const copyBibtexBtn = document.getElementById('copyBibtexBtn');

  const abstractTriggers = document.querySelectorAll('[data-open-abstract]');
  abstractTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pub-item');
      if (!card) return;

      const title = card.getAttribute('data-title') || 'Publikasi Ilmiah';
      const meta = card.getAttribute('data-meta') || '';
      const abstract = card.getAttribute('data-abstract') || 'Abstrak tidak tersedia.';
      const bibtex = card.getAttribute('data-bibtex') || '';

      if (abstractTitle) abstractTitle.textContent = title;
      if (abstractMeta) abstractMeta.textContent = meta;
      if (abstractText) abstractText.textContent = abstract;
      if (abstractBibtex) abstractBibtex.textContent = bibtex;

      if (abstractModal) {
        abstractModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  if (closeAbstractBtn && abstractModal) {
    closeAbstractBtn.addEventListener('click', () => {
      abstractModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  if (copyBibtexBtn && abstractBibtex) {
    copyBibtexBtn.addEventListener('click', () => {
      const text = abstractBibtex.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const original = copyBibtexBtn.innerHTML;
        copyBibtexBtn.innerHTML = '<i class="fa-solid fa-check text-green-500 mr-1.5"></i> Tersalin!';
        setTimeout(() => {
          copyBibtexBtn.innerHTML = original;
        }, 2200);
      });
    });
  }

  // --- CV Modal ---
  const cvModal = document.getElementById('cvModal');
  const cvTriggers = document.querySelectorAll('[data-open-cv]');
  const closeCvBtn = document.getElementById('closeCvBtn');
  const printCvBtn = document.getElementById('printCvBtn');

  cvTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (cvModal) {
        cvModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  if (closeCvBtn && cvModal) {
    closeCvBtn.addEventListener('click', () => {
      cvModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Gallery Lightbox Modal ---
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryModalImage');
  const galleryCaption = document.getElementById('galleryModalCaption');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const galleryTriggers = document.querySelectorAll('[data-gallery-src]');

  galleryTriggers.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-gallery-src');
      const caption = item.getAttribute('data-gallery-caption') || '';

      if (galleryImage) galleryImage.src = src;
      if (galleryCaption) galleryCaption.textContent = caption;

      if (galleryModal) {
        galleryModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  if (closeGalleryBtn && galleryModal) {
    closeGalleryBtn.addEventListener('click', () => {
      galleryModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Close modals on backdrop click or Escape key
  [abstractModal, cvModal, galleryModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [abstractModal, cvModal, galleryModal].forEach(modal => {
        if (modal && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      });
    }
  });
}

/* ==========================================================================
   7. Contact & Consultation Form Handler with Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  if (!form) return;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('bloom-element');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#senderName')?.value.trim();
    const email = form.querySelector('#senderEmail')?.value.trim();
    const purpose = form.querySelector('#contactPurpose')?.value;
    const message = form.querySelector('#senderMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('Mohon lengkapi Nama, Email, dan Pesan Anda.');
      return;
    }

    // Success simulation
    showToast(`Terima kasih, ${name}! Pesan mengenai "${purpose || 'Konsultasi'}" berhasil dikirim. Dr. Ayu Lestari akan segera merespons.`);
    form.reset();
  });
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      btn.classList.add('opacity-100', 'translate-y-0');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      btn.classList.remove('opacity-100', 'translate-y-0');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Academic ID 1-Click Copy
   ========================================================================== */
function initCopyAcademicIds() {
  const copyButtons = document.querySelectorAll('[data-copy-id]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = btn.getAttribute('data-copy-id');
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
        setTimeout(() => {
          btn.innerHTML = original;
        }, 1800);
      });
    });
  });
}
