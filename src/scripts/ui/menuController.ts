export const initMenuController = () => {
  const menuToggle = document.getElementById('hmbrgr-menu-toggle');
  const mobileMenu = document.getElementById('hmbrgr-menu');
  const header = document.querySelector('header');

  if (!menuToggle || !mobileMenu || !header) return;

  const toggleMenu = () => {
    if (mobileMenu.classList.contains('closing')) {
      mobileMenu.classList.remove('closing');
      header.classList.add('menu-open');
    } else if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.add('closing');
      header.classList.remove('menu-open');
    } else {
      mobileMenu.classList.add('open');
      header.classList.add('menu-open');
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileMenu.addEventListener('animationend', (e) => {
    if (e.target === mobileMenu && mobileMenu.classList.contains('closing')) {
      mobileMenu.classList.remove('open');
      mobileMenu.classList.remove('closing');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileMenu.classList.remove('closing');
      header.classList.remove('menu-open');
    }
  });

  // Hamburger Nav Logic
  const navItems = document.querySelectorAll('.hmbrgr-nav');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index') || '0');
      const panels = document.querySelectorAll<HTMLElement>('.panel');
      if (panels[index]) {
        if (menuToggle) (menuToggle as HTMLElement).click();
        const top = panels[index].offsetTop - (header as HTMLElement).offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const isMenuOpen = mobileMenu.classList.contains('open');
    const isClickInsideMenu = mobileMenu.contains(target);
    const isClickOnHeader = header.contains(target);

    if (isMenuOpen && !isClickInsideMenu && !isClickOnHeader) {
      if (menuToggle) (menuToggle as HTMLElement).click();
    }
  });
};
