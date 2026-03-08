export const initMenuController = () => {
  const menuToggle = document.getElementById("hmbrgr-menu-toggle");
  const mobileMenu = document.getElementById("hmbrgr-menu");
  const header = document.querySelector("header");

  if (!menuToggle || !mobileMenu || !header) return;

  const toggleMenu = () => {
    const isReducedMotion = document.documentElement.getAttribute("data-reduced-motion") === "true";

    // OPENING logic
    if (!mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("closing");
      mobileMenu.classList.add("open");
      header.classList.add("menu-open");
      return;
    }

    // CLOSING logic
    if (isReducedMotion) {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.remove("closing");
      header.classList.remove("menu-open");
    } else {
      // Start closing animation
      mobileMenu.classList.add("closing");
      header.classList.remove("menu-open");
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  mobileMenu.addEventListener("animationend", (e) => {
    if (e.target === mobileMenu && mobileMenu.classList.contains("closing")) {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.remove("closing");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200 && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      mobileMenu.classList.remove("closing");
      header.classList.remove("menu-open");
    }
  });

  // Hamburger Nav Logic
  const navItems = document.querySelectorAll(".hmbrgr-nav");
  navItems.forEach((item) => {
    const onSelect = () => {
      const index = parseInt(item.getAttribute("data-index") || "0");
      const panels = document.querySelectorAll<HTMLElement>(".panel");
      if (panels[index]) {
        // Use the controller's toggle so it handles the closing logic/animations
        toggleMenu();

        const top = panels[index].offsetTop - (header as HTMLElement).offsetHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    item.addEventListener("click", onSelect);
    item.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") {
        (e as KeyboardEvent).preventDefault();
        onSelect();
      }
    });
  });

  // Global click-to-close
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const isMenuOpen = mobileMenu.classList.contains("open");
    const isClickInsideMenu = mobileMenu.contains(target);
    const isClickOnHeader = header.contains(target);

    if (isMenuOpen && !isClickInsideMenu && !isClickOnHeader) {
      toggleMenu();
    }
  });
};
