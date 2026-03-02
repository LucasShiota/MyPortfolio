export const initSectionTracker = () => {
  const sections = document.querySelectorAll('section[id], div[id].hero-section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the upper part of the viewport
    threshold: 0
  };

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Find the specific link for this section
        const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (targetLink) {
          // Remove active from all and add to current
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
};
