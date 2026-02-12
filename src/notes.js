/* 


<div class="top">
		<h1 class="hero-text">🧑‍🚀 Hello, Astronaut!</h1>
		<script>
			import { gsap } from "gsap";
			import { SplitText } from "gsap/SplitText";
			gsap.registerPlugin(SplitText);
			let split = SplitText.create(".hero-text", {type:"words,chars"});
			var tl = gsap.timeline();
			tl.from(split.chars, {duration: .5, opacity: 0, stagger: .125,  ease: 'power1. In'});
		</script>
	</div>
	
		
		

</main>
	<div class="bottom">
	</div>



---
import "../styles/project-styles.css"; 
---
<div class="projects-wrapper">
  <section class="project-list">
    <article class="project-entry" id="1">
      <h3 class="project-title drg-mod"> Destructively<br>Expressive Icons </h3>
      <p class="project-desc"> Deep Rock Galactic Visual Mod</p>
    </article>
    <article class="project-entry " id="2">
      <h3 class="project-title baraliot"> Baraliot Fantasia </h3>
      <p class="project-desc"> Deckbuilding Fantasy TRPG</p>
    </article>
    <article class="project-entry" id="3">
      <h3 class="project-title tf2map"> Koth_Billabong </h3>
      <p class="project-desc"> Team Fortress 2 Map</p>
    </article>
    <article class="project-entry" id="4">
      <h3 class="project-title tokyogrunge"> Tokyo Grunge </h3>
      <p class="project-desc"> Photo Series of Paint, Vinyl, and Urban Entropy</p>
    </article>
    <article class="project-entry" id="5">
      <h3 class="project-title"> Portfolio Website </h3>
      <p class="project-desc"> No Website Builders, just Pure Code </p>
    </article>
    <article class="project-entry" >
      <h3 class="project-title personalblog"> Personal Blog </h3>
      <p class="project-desc"> Video Game Topics I'm Passionate About</p>
    </article>
  </section>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      const projectList = document.querySelector(".project-list");
      if (projectList) {
        // Scroll to 50% of total scrollable height
        projectList.scrollTop = projectList.scrollHeight * 0.3;
      }
    });
  </script>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLElement>(".project-list");
  const entries = Array.from(document.querySelectorAll<HTMLElement>(".project-entry"));
  const previews = Array.from(document.querySelectorAll<HTMLElement>(".preview-entry"));

  if (!container || entries.length === 0 || previews.length === 0) return;

  let currentIndex = 0;
  let isScrolling = false;

  const updateActiveByCenter = () => {
    const containerRect = container.getBoundingClientRect();
    const center = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    entries.forEach((entry, i) => {
      const rect = entry.getBoundingClientRect();
      const entryCenter = rect.top + rect.height / 2;
      const distance = Math.abs(center - entryCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    currentIndex = closestIndex;

    entries.forEach((entry, i) => entry.classList.toggle("is-active", i === currentIndex));

    // sync preview
    const activeId = entries[currentIndex].id;
    previews.forEach(p => p.classList.toggle("active", p.id === activeId));
  };

  const scrollToIndex = (index: number) => {
    if (!entries[index]) return;
    isScrolling = true;

    entries[index].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      isScrolling = false;
      updateActiveByCenter(); // make sure preview updates after scroll
    }, 400);
  };

  container.addEventListener(
    "wheel",
    (e) => {
      if (isScrolling) return;
      e.preventDefault();
      currentIndex = e.deltaY > 0
        ? Math.min(currentIndex + 1, entries.length - 1)
        : Math.max(currentIndex - 1, 0);
      scrollToIndex(currentIndex);
    },
    { passive: false }
  );

  container.addEventListener("scroll", updateActiveByCenter);

  // initial state
  updateActiveByCenter();
});

  </script>
</div>








*/