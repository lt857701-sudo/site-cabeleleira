// Luxe Hair Studio - main.js
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Comparador Antes/Depois ---
(function () {
  const container = document.querySelector('[data-purpose="before-after-display"]');
  if (!container) return;

  const afterWrap = document.getElementById('ba-after-wrap');
  const divider = document.getElementById('ba-divider');
  const handle = document.getElementById('ba-handle');

  if (!afterWrap || !divider || !handle) return;

  let active = false;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function updateFromClientX(clientX) {
    const rect = container.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = clamp(pct, 0, 100);

    afterWrap.style.width = pct + '%';
    divider.style.left = pct + '%';
    divider.style.transform = 'translateX(-50%)';
    handle.style.left = pct + '%';
    handle.style.transform = 'translateX(-50%)';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function start(evt) {
    active = true;
    container.classList.add('select-none');
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    updateFromClientX(clientX);
  }

  function move(evt) {
    if (!active) return;
    evt.preventDefault();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    updateFromClientX(clientX);
  }

  function end() {
    active = false;
    container.classList.remove('select-none');
  }

  // Mouse
  handle.addEventListener('mousedown', (e) => { e.preventDefault(); start(e); });
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  // Touch
  handle.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', end);

  // Teclado (setas esquerda/direita)
  handle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const current = parseFloat(handle.getAttribute('aria-valuenow') || '50');
      const rect = container.getBoundingClientRect();
      const targetPx = rect.left + (rect.width * (current - 2) / 100);
      updateFromClientX(targetPx);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const current = parseFloat(handle.getAttribute('aria-valuenow') || '50');
      const rect = container.getBoundingClientRect();
      const targetPx = rect.left + (rect.width * (current + 2) / 100);
      updateFromClientX(targetPx);
    }
  });

  // Inicializa na posição central
  const rect = container.getBoundingClientRect();
  updateFromClientX(rect.left + rect.width / 2);
})();

// --- Menu hambúrguer mobile ---
function toggleMobileMenu(btn) {
  const nav = document.getElementById('mobile-nav');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !expanded);
  btn.classList.toggle('active');
  nav.classList.toggle('open');
}

// Fecha o menu ao clicar em um link
document.querySelectorAll('.mobile-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('mobile-nav');
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('active');
    nav.classList.remove('open');
  });
});
