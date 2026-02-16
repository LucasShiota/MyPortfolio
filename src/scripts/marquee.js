import { gsap } from "gsap";
export function initMarquees() {
  document.addEventListener("DOMContentLoaded", () => {
    const marquees = document.querySelectorAll(".marquee");

    marquees.forEach((marquee) => {
      const track = marquee.querySelector(".marquee-track");
      const content = marquee.querySelector(".marquee-content");

      if (!track || !content) return;

      // Duplicate content for seamless loop
      const clone = content.cloneNode(true);
      track.appendChild(clone);

      gsap.set(track, { force3D: true });

      let position = 0;
      let width = content.getBoundingClientRect().width;

      // Detect direction
      const direction = marquee.dataset.direction === "right" ? 1 : -1;

      // Optional: automatically fill viewport if text is short
      while (track.scrollWidth < window.innerWidth * 2) {
        const extraClone = content.cloneNode(true);
        track.appendChild(extraClone);
      }

      const speed = 2; // pixels per second

      // Watch for text resize
      const resizeObserver = new ResizeObserver(() => {
        width = content.getBoundingClientRect().width;
      });
      resizeObserver.observe(content);

      // Ticker loop
      gsap.ticker.add(() => {
        position += speed * direction * gsap.ticker.deltaRatio() * 0.5;

        // Wrap around
        if (direction === -1 && position <= -width) {
          position = 0;
        } else if (direction === 1 && position >= width) {
          position = 0;
        }

        gsap.set(track, { x: position });
      });
    });
  });
}
