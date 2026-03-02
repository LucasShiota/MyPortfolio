export const initJumpToController = () => {
  const toggleBtn = document.getElementById('jump-toggle');
  const jumpNav = document.getElementById('jump-nav');

  if (!toggleBtn || !jumpNav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    jumpNav.classList.toggle('is-open');
  });

  // Close when clicking a link (especially useful on mobile)
  const links = jumpNav.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        jumpNav.classList.remove('is-open');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!toggleBtn.contains(target) && !jumpNav.contains(target)) {
      if (window.innerWidth < 1024 && jumpNav.classList.contains('is-open')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        jumpNav.classList.remove('is-open');
      }
    }
  });
};
