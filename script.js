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

// ============================================================
// Mobile burger / slide-in drawer
// Reads <nav class="nav"> at runtime — no HTML changes needed on
// any page (index, photography, business, contact, all galleries).
// data-et / data-en attributes come with the cloned links so
// applyLanguage() keeps the drawer text in sync automatically.
// ============================================================
(function () {
  var navRow    = document.querySelector('.nav-row');
  var sourceNav = document.querySelector('nav.nav');
  if (!navRow || !sourceNav) return;

  // ── Burger button (appended to nav-row) ────────────────────
  var burger = document.createElement('button');
  burger.className = 'burger-toggle';
  burger.setAttribute('aria-label', 'Open navigation');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span><span></span><span></span>';
  navRow.appendChild(burger);

  // ── Backdrop ───────────────────────────────────────────────
  var backdrop = document.createElement('div');
  backdrop.className = 'mobile-drawer-backdrop';
  document.body.appendChild(backdrop);

  // ── Drawer ─────────────────────────────────────────────────
  var drawer = document.createElement('div');
  drawer.className = 'mobile-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Navigation');

  var closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-drawer-close';
  closeBtn.setAttribute('aria-label', 'Close navigation');
  closeBtn.textContent = '✕';
  drawer.appendChild(closeBtn);

  var linkNav = document.createElement('nav');
  sourceNav.querySelectorAll('a').forEach(function (a) {
    linkNav.appendChild(a.cloneNode(true));
  });
  drawer.appendChild(linkNav);

  // Clone the standalone real-estate CTA (lives outside nav.nav, in .header-actions)
  var headerCta = navRow.querySelector('.nav-cta');
  if (headerCta) {
    var drawerCta = headerCta.cloneNode(true);
    drawerCta.classList.add('mobile-drawer-cta');
    drawerCta.addEventListener('click', closeDrawer);
    drawer.appendChild(drawerCta);
  }

  // Clone header lang toggle — keeps onclick="toggleLanguage()" intact
  var headerLang = navRow.querySelector('.lang-toggle');
  if (headerLang) {
    var drawerLang = headerLang.cloneNode(true);
    drawerLang.classList.add('mobile-drawer-lang');
    drawer.appendChild(drawerLang);
  }

  document.body.appendChild(drawer);

  // ── Open / close ───────────────────────────────────────────
  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close on link tap (handles same-page anchors like #videography)
  linkNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();

// ============================================================
// Cookie consent — Google Consent Mode v2
// Analytics/ads storage starts 'denied' (set in the gtag snippet
// in each page's <head>). We only flip it to 'granted' after the
// visitor explicitly accepts, and we remember the choice.
// ============================================================
(function () {
  if (typeof window === 'undefined') return;
  var KEY = 'cookie-consent';

  function updateConsent(granted) {
    if (typeof gtag !== 'function') return;
    var state = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  var stored = localStorage.getItem(KEY);
  // Returning visitor who already decided → apply silently, no banner.
  if (stored === 'granted') { updateConsent(true); return; }
  if (stored === 'denied')  { updateConsent(false); return; }

  // First visit → build the banner.
  var banner = document.createElement('div');
  banner.className = 'cookie-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Cookie consent');

  var p = document.createElement('p');
  p.setAttribute('data-et', 'Kasutame küpsiseid saidi liikluse analüüsimiseks (Google Analytics). Kas oled nõus?');
  p.setAttribute('data-en', 'We use cookies to analyse site traffic (Google Analytics). Is that okay?');
  banner.appendChild(p);

  var actions = document.createElement('div');
  actions.className = 'cookie-consent-actions';

  var accept = document.createElement('button');
  accept.type = 'button';
  accept.className = 'cookie-btn cookie-btn--accept';
  accept.setAttribute('data-et', 'Nõustun');
  accept.setAttribute('data-en', 'Accept');

  var decline = document.createElement('button');
  decline.type = 'button';
  decline.className = 'cookie-btn cookie-btn--decline';
  decline.setAttribute('data-et', 'Keeldun');
  decline.setAttribute('data-en', 'Decline');

  actions.appendChild(accept);
  actions.appendChild(decline);
  banner.appendChild(actions);
  document.body.appendChild(banner);

  // Localise the freshly-added nodes to the current language.
  applyLanguage(localStorage.getItem('lang') || 'et');

  requestAnimationFrame(function () { banner.classList.add('is-visible'); });

  function dismiss(granted) {
    localStorage.setItem(KEY, granted ? 'granted' : 'denied');
    updateConsent(granted);
    banner.classList.remove('is-visible');
    setTimeout(function () { if (banner.parentNode) banner.remove(); }, 400);
  }

  accept.addEventListener('click', function () { dismiss(true); });
  decline.addEventListener('click', function () { dismiss(false); });
})();

// ============================================================
// Contact form → GA4 lead event (fires on Formspree success)
// The Formspree library reveals [data-fs-success] on a sent message;
// we watch for that and report a 'generate_lead' event once.
// (Google Ads conversion line will be added here once the AW- ID
//  and conversion label are available.)
// ============================================================
(function () {
  var success = document.querySelector('[data-fs-success]');
  if (!success) return;
  var fired = false;

  function isVisible(el) {
    return el.offsetParent !== null && getComputedStyle(el).display !== 'none';
  }

  function maybeFire() {
    if (fired || !isVisible(success)) return;
    fired = true;
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'contact',
        event_label: 'contact_form'
      });
    }
  }

  var mo = new MutationObserver(maybeFire);
  mo.observe(success, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
})();
