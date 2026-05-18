// Footer year
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Before/after compare slider
function initCompareSlider(el) {
  let dragging = false;

  function setPos(clientX) {
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = (x / rect.width) * 100;
    el.style.setProperty('--pos', pct + '%');
  }

  function getX(e) {
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    return e.clientX;
  }

  function onStart(e) {
    dragging = true;
    setPos(getX(e));
    if (e.cancelable) e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    setPos(getX(e));
    if (e.cancelable) e.preventDefault();
  }
  function onEnd() { dragging = false; }

  el.addEventListener('mousedown', onStart);
  el.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
}

document.querySelectorAll('[data-compare]').forEach(initCompareSlider);
