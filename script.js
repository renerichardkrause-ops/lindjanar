// Footer year
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ============================================================
// Language switcher — ET (default) / EN
//
// HOW TO EDIT TRANSLATIONS:
//   Estonian copy → find the element in the HTML and edit its data-et="..." attribute
//   English copy  → edit the data-en="..." attribute on the same element
//   For paragraphs with links inside → edit data-et-html / data-en-html
//   For form placeholders → edit data-et-placeholder / data-en-placeholder
// ============================================================
function applyLanguage(lang) {
  document.querySelectorAll('[data-et]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('[data-et-html]').forEach(el => {
    el.innerHTML = el.getAttribute('data-' + lang + '-html');
  });
  document.querySelectorAll('[data-et-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-' + lang + '-placeholder');
  });
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'et' ? 'EN' : 'ET';
    btn.setAttribute('aria-label', lang === 'et' ? 'Switch to English' : 'Lülitu eesti keelele');
  });
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
}

function toggleLanguage() {
  const current = localStorage.getItem('lang') || 'et';
  applyLanguage(current === 'et' ? 'en' : 'et');
}

window.toggleLanguage = toggleLanguage;

// Apply saved language on every page load (default: Estonian)
applyLanguage(localStorage.getItem('lang') || 'et');

// Before/after compare slider
function initCompareSlider(el) {
  let dragging = false;

  function setPos(clientX) {
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    el.style.setProperty('--pos', (x / rect.width * 100) + '%');
  }

  function getX(e) {
    return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e) { dragging = true; setPos(getX(e)); if (e.cancelable) e.preventDefault(); }
  function onMove(e) { if (!dragging) return; setPos(getX(e)); if (e.cancelable) e.preventDefault(); }
  function onEnd() { dragging = false; }

  el.addEventListener('mousedown', onStart);
  el.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
}

document.querySelectorAll('[data-compare]').forEach(initCompareSlider);

// ============================================================
// Inclusions scroll-reveal — fades items in as they enter viewport
// ============================================================
(function () {
  if (typeof window === 'undefined') return;
  var items = document.querySelectorAll('.inclusions__item');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();

// ============================================================
// Lightbox — single-image gallery thumbnails (.gallery-thumb--lightbox)
// ============================================================
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var img = lightbox.querySelector('.lightbox-img');
  var bg  = lightbox.querySelector('.lightbox-bg');
  var btn = lightbox.querySelector('.lightbox-close');

  function open(src) {
    img.src = src;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { img.src = ''; }, 250);
  }

  document.querySelectorAll('.gallery-thumb--lightbox').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      open(el.dataset.img);
    });
  });

  if (btn) btn.addEventListener('click', close);
  if (bg)  bg.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
})();
