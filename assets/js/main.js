/**
 * Ir. Ayu Sintianingrum, S.T., M.T. Academic Portfolio - Interactive Scripts
 * Dosen & Peneliti Bidang Tenaga Listrik, Elektronika Daya dan Internet of Things (IoT)
 * Features: Floating Daisy Canvas, Filter & Search, Modals, Stats Counter, 1-Click Copy IDs
 */

document.addEventListener('DOMContentLoaded', () => {
  initDaisyPetalsCanvas();
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initPublicationFilters();
  initModals();
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
          ctx.ellipse(0, -r, r * 0.4, r * 0.85, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = 'rgba(251, 111, 146, 0.25)';
          ctx.lineWidth = 0.4;
          ctx.stroke();
          ctx.restore();
        }

        // Yellow Gold Center Stamen
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFC107';
        ctx.fill();
        ctx.strokeStyle = '#FFA000';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new DaisyPetal());
    }
  }

  function animate() {
    if (!isEnabled) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  function updateToggleUI() {
    if (!toggleBtn) return;
    if (isEnabled) {
      toggleBtn.classList.remove('bg-white', 'text-plum-700', 'border-pink-200');
      toggleBtn.classList.add('bg-pink-100', 'text-pink-700', 'border-pink-300', 'shadow-sm');
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-fan animate-spin-slow text-pink-500';
      if (toggleText) toggleText.textContent = 'Kelopak Daisy (Aktif)';
    } else {
      toggleBtn.classList.remove('bg-pink-100', 'text-pink-700', 'border-pink-300', 'shadow-sm');
      toggleBtn.classList.add('bg-white', 'text-plum-700', 'border-pink-200');
      if (toggleIcon) toggleIcon.className = 'fa-solid fa-power-off text-plum-700';
      if (toggleText) toggleText.textContent = 'Kelopak Daisy (Nonaktif)';
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isEnabled = !isEnabled;
      localStorage.setItem('daisyPetalsEnabled', isEnabled ? 'true' : 'false');
      updateToggleUI();
      if (isEnabled) {
        if (!animationId) {
          initParticles();
          animate();
        }
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }

  updateToggleUI();
  if (isEnabled) {
    initParticles();
    animate();
  }
}

/* ==========================================================================
   2. Responsive Mobile Drawer Navigation
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const drawer = document.getElementById('mobileMenuDrawer');
  const backdrop = document.getElementById('mobileMenuBackdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   3. Smooth Scrollspy & Active Navigation Link Highlighter
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('nav .nav-link');

  if (!sections.length || !desktopLinks.length) return;

  function highlightLink() {
    let scrollY = window.pageYOffset + 120;

    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop;
      const secId = sec.getAttribute('id');

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('text-pink-600', 'font-bold');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('text-pink-600', 'font-bold');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightLink);
  highlightLink();
}

/* ==========================================================================
   4. Animated Metric Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-val');
  if (!statElements.length) return;

  let hasAnimated = false;
  const container = document.getElementById('statsContainer');
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);

  function animateCounters() {
    statElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        el.textContent = current.toLocaleString('id-ID') + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString('id-ID') + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

/* ==========================================================================
   5. Publication Filter Tabs and Instant Search
   ========================================================================== */
function initPublicationFilters() {
  const tabButtons = document.querySelectorAll('.pub-tab-btn');
  const searchInput = document.getElementById('pubSearchInput');
  const pubItems = document.querySelectorAll('.pub-item');
  const countDisplay = document.getElementById('pubCountDisplay');
  const noResultElement = document.getElementById('pubNoResult');
  const resetBtn = document.getElementById('resetSearchBtn');

  if (!pubItems.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    const query = searchQuery.toLowerCase().trim();

    pubItems.forEach(item => {
      const itemCat = item.getAttribute('data-category') || '';
      const itemTitle = (item.getAttribute('data-title') || '').toLowerCase();
      const itemMeta = (item.getAttribute('data-meta') || '').toLowerCase();
      const itemText = item.textContent.toLowerCase();

      const matchCat = (currentCategory === 'all') || (itemCat === currentCategory);
      const matchSearch = !query || itemTitle.includes(query) || itemMeta.includes(query) || itemText.includes(query);

      if (matchCat && matchSearch) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Menampilkan ${visibleCount} publikasi terpilih`;
    }

    if (noResultElement) {
      if (visibleCount === 0) {
        noResultElement.classList.remove('hidden');
      } else {
        noResultElement.classList.add('hidden');
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
      btn.classList.remove('bg-white', 'text-plum-700', 'border', 'border-pink-200');

      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      currentCategory = 'all';
      tabButtons.forEach((b, idx) => {
        if (idx === 0) {
          b.classList.add('bg-pink-600', 'text-white', 'shadow-md');
          b.classList.remove('bg-white', 'text-plum-700', 'border', 'border-pink-200');
        } else {
          b.classList.remove('bg-pink-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-plum-700', 'border', 'border-pink-200');
        }
      });
      applyFilters();
    });
  }

  applyFilters();
}

/* ==========================================================================
   6. Modals (Abstract Viewer & Curriculum Vitae)
   ========================================================================== */
function initModals() {
  const abstractModal = document.getElementById('abstractModal');
  const closeAbstractBtn = document.getElementById('closeAbstractBtn');
  const abstractModalTitle = document.getElementById('abstractModalTitle');
  const abstractModalMeta = document.getElementById('abstractModalMeta');
  const abstractModalText = document.getElementById('abstractModalText');
  const abstractModalBibtex = document.getElementById('abstractModalBibtex');
  const copyBibtexBtn = document.getElementById('copyBibtexBtn');

  // Open Abstract Modal
  const openAbstractBtns = document.querySelectorAll('[data-open-abstract]');
  openAbstractBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pubCard = e.target.closest('.pub-item');
      if (!pubCard || !abstractModal) return;

      const title = pubCard.getAttribute('data-title') || 'Publikasi Ilmiah';
      const meta = pubCard.getAttribute('data-meta') || '';
      const abstract = pubCard.getAttribute('data-abstract') || 'Abstrak tidak tersedia.';
      const bibtex = pubCard.getAttribute('data-bibtex') || '';

      if (abstractModalTitle) abstractModalTitle.textContent = title;
      if (abstractModalMeta) abstractModalMeta.textContent = meta;
      if (abstractModalText) abstractModalText.textContent = abstract;
      if (abstractModalBibtex) abstractModalBibtex.textContent = bibtex;

      abstractModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  if (closeAbstractBtn && abstractModal) {
    closeAbstractBtn.addEventListener('click', () => {
      abstractModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Copy BibTeX citation
  if (copyBibtexBtn && abstractModalBibtex) {
    copyBibtexBtn.addEventListener('click', () => {
      const textToCopy = abstractModalBibtex.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = copyBibtexBtn.innerHTML;
        copyBibtexBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i><span>Tersalin!</span>';
        copyBibtexBtn.classList.add('bg-emerald-100', 'text-emerald-800');

        setTimeout(() => {
          copyBibtexBtn.innerHTML = originalHtml;
          copyBibtexBtn.classList.remove('bg-emerald-100', 'text-emerald-800');
        }, 2200);
      });
    });
  }

  // CV Modal
  const cvModal = document.getElementById('cvModal');
  const openCvBtns = document.querySelectorAll('[data-open-cv]');
  const closeCvBtn = document.getElementById('closeCvBtn');
  const printCvBtn = document.getElementById('printCvBtn');

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
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

  // Close modals on backdrop click or Escape key
  [abstractModal, cvModal].forEach(modal => {
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
      [abstractModal, cvModal].forEach(modal => {
        if (modal && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      });
    }
  });
}

/* ==========================================================================
   7. Back to Top Button
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
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. 1-Click Copy Academic Identifiers (SINTA, Scholar, etc.)
   ========================================================================== */
function initCopyAcademicIds() {
  const copyButtons = document.querySelectorAll('[data-copy-id]');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idVal = btn.getAttribute('data-copy-id');
      if (!idVal) return;

      navigator.clipboard.writeText(idVal).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i>';
        showToast(`ID Akademik "${idVal}" berhasil disalin ke clipboard!`);

        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      }).catch(() => {
        showToast(`ID Akademik: ${idVal}`);
      });
    });
  });
}
