/*
const container = document.querySelector("project-wrapper");
const original = container.querySelector("project-list");

const cloned = original.cloneNode(true);
container.appendChild(cloned);

const threshold = 120;

window.addEventListener("scroll", () => {
  const halfHeight = original.clientHeight;

  if(window.scrollY >= halfHeight + threshold) {
    window.scrollTo(0, window.scrollY - halfHeight);
  }
  else if(window.scrollY <= threshold) {
    window.scrollTo(0, window.scrollY + halfHeight); 
  }
});
*/

const projects = document.querySelectorAll(".project");
const container = document.querySelector(".projects");

container.addEventListener("scroll", () => {
  const centerY = container.offsetHeight / 2;

  projects.forEach(project => {
    const rect = project.getBoundingClientRect();
    const projectCenter = rect.top + rect.height / 2 - container.getBoundingClientRect().top;

    // distance from viewport center
    const distance = Math.abs(centerY - projectCenter);

    // scale projects based on distance
    const scale = Math.max(0.9, 1 - distance / 600); // tweak denominator for effect
    project.style.transform = `scale(${scale})`;

    // optional: reduce opacity slightly
    const opacity = Math.max(0.6, 1 - distance / 800);
    project.style.opacity = opacity;
  });
});
