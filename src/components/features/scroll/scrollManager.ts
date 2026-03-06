import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

declare global {
	interface Window {
		performanceModeScroll?: {
			enableSnap: () => void;
			disableSnap: () => void;
			refresh: () => void;
		};
		__performanceModeEnabled?: boolean;
	}
}

/**
 * Initializes Keyboard Snapping logic.
 * Uses progress-based math identical to the snap system so the two never disagree.
 */
export function initKeyboardScroll() {
	gsap.registerPlugin(ScrollToPlugin);

	let isScrolling = false;

	function handleKeyboard(e: KeyboardEvent) {
		const isSpace = e.code === "Space";
		const isPageDown = e.code === "PageDown";
		const isPageUp = e.code === "PageUp";

		if (!isSpace && !isPageDown && !isPageUp) return;

		const active = document.activeElement;
		if (
			active &&
			(active.tagName === "INPUT" ||
				active.tagName === "TEXTAREA" ||
				(active as HTMLElement).isContentEditable)
		) {
			return;
		}

		e.preventDefault();
		if (isScrolling) return;

		const isForward = isPageDown || (isSpace && !e.shiftKey);

		// Use the same panel-count / progress math the snap system uses
		const panels = gsap.utils.toArray<HTMLElement>(".panel");
		const totalSteps = panels.length > 0 ? panels.length - 1 : 0;

		if (totalSteps <= 0) {
			// No panels – fall back to a viewport-sized scroll
			const amount = window.innerHeight * 0.8;
			const scrollY = window.scrollY;
			gsap.to(window, {
				duration: 0.5,
				scrollTo: { y: isForward ? scrollY + amount : scrollY - amount },
				ease: "power2.out"
			});
			return;
		}

		const step = 1 / totalSteps;
		const maxScroll = document.body.scrollHeight - window.innerHeight;
		const currentProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
		const currentIndex = Math.round(currentProgress / step);

		const nextIndex = isForward
			? Math.min(currentIndex + 1, totalSteps)
			: Math.max(currentIndex - 1, 0);

		// If we're already at the boundary, nothing to do
		if (nextIndex === currentIndex) return;

		const targetProgress = nextIndex * step;
		const targetY = targetProgress * maxScroll;

		// Temporarily disable snapping so it can't fight the tween
		window.performanceModeScroll?.disableSnap?.();
		isScrolling = true;

		gsap.to(window, {
			duration: 0.7,
			scrollTo: { y: targetY },
			ease: "power4.out",
			onComplete: () => {
				isScrolling = false;
				// Re-enable snapping only if performance mode isn't active
				if (!window.__performanceModeEnabled) {
					window.performanceModeScroll?.enableSnap?.();
				}
			}
		});
	}

	window.addEventListener("keydown", handleKeyboard, { passive: false });
}

/**
 * Initializes Panel Scroll behaviors (Snapping, Hash Sync, Sidebar visuals, Navigation, Resize).
 * Combines logic from: ScrollSidebar, ScrollSnapping, ScrollHashSync, ScrollNavigation, ScrollResize
 */
export function initPanelScroll() {
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	const panels = gsap.utils.toArray<HTMLElement>(".panel");
	const totalSteps = panels.length > 0 ? panels.length - 1 : 0;
	const step = totalSteps > 0 ? 1 / totalSteps : 1;

	// --- 1. Navigation / ScrollTo Logic ---
	const navSections = document.querySelectorAll<HTMLElement>(".nav-section");
	const SECTION_INDEX_STEP = 2; // Sidebar indexing
	let activeScrollTween: gsap.core.Tween | null = null;

	function scrollToIndex(index: number) {
		if (totalSteps <= 0) return;
		const clamped = gsap.utils.clamp(0, totalSteps, index);
		const targetProgress = clamped * step;

		activeScrollTween?.kill();
		activeScrollTween = gsap.to(window, {
			duration: 0.8,
			scrollTo: {
				y: targetProgress * (document.body.scrollHeight - window.innerHeight)
			},
			ease: "power2.inOut"
		});
	}

	navSections.forEach((section) => {
		section.style.cursor = "pointer";
		section.addEventListener("click", () => {
			const navDataIndex = Number(section.dataset.index);
			if (Number.isNaN(navDataIndex)) return;
			scrollToIndex(navDataIndex / SECTION_INDEX_STEP);
		});
	});

	// --- 2. Master ScrollTrigger logic for Hash & Sidebar UI ---
	const panelNames = ["hello", "projects", "about", "contacts"];
	const sidebar = document.querySelector<HTMLElement>(".sidebar");
	const ICON_BASE_SCALE = 1;
	const SIDEBAR_SCALE = { min: 1, max: 1.45, falloffRate: 1, falloffPower: 1.7 } as const;
	const contactsEnterThreshold = gsap.utils.clamp(0, 1, 1 - step * 0.5);

	function updateSidebarVisuals(progress: number) {
		if (totalSteps <= 0) return;
		const activeSectionPosition = progress * totalSteps;

		navSections.forEach((sectionEl, sectionIndex) => {
			const sectionDistanceFromActive = Math.abs(sectionIndex - activeSectionPosition);
			// Calculate falloff scale
			const falloff = Math.exp(
				-SIDEBAR_SCALE.falloffRate * Math.pow(sectionDistanceFromActive, SIDEBAR_SCALE.falloffPower)
			);
			const sectionScale = SIDEBAR_SCALE.min + (SIDEBAR_SCALE.max - SIDEBAR_SCALE.min) * falloff;

			sectionEl.style.transform = `scale(${sectionScale})`;

			const iconEl = sectionEl.querySelector<HTMLElement>(".navsec-icon");
			if (iconEl) {
				iconEl.style.transform = `translate(-50%, -50%) scale(${ICON_BASE_SCALE * sectionScale})`;
			}
		});

		if (sidebar) {
			sidebar.classList.toggle("contacts-entering", progress >= contactsEnterThreshold);
		}
	}

	function updateHashSync(progress: number) {
		const index = Math.round(progress * totalSteps);
		const currentHash = progress < 0.05 ? "" : `#${panelNames[index] || panelNames[panelNames.length - 1]}`;
		const newURL = currentHash === "" ? window.location.pathname + window.location.search : currentHash;

		if (window.location.hash !== currentHash) {
			history.replaceState(null, "", newURL);
		}
	}

	// Make one Master Trigger instead of creating multiple
	let masterTrigger = ScrollTrigger.create({
		id: "master-panel-scroll",
		trigger: document.body,
		start: "top top",
		end: "bottom bottom",
		scrub: 0.5,
		onUpdate: (self) => {
			updateSidebarVisuals(self.progress);
			updateHashSync(self.progress);
		},
		onRefresh: (self) => updateSidebarVisuals(self.progress)
	});

	// --- 3. Scroll Snapping Logic ---
	let snapTrigger: any = null;

	const enableSnapping = () => {
		if (snapTrigger || totalSteps <= 0) return;
		snapTrigger = ScrollTrigger.create({
			id: "snapping",
			trigger: document.body,
			start: "top top",
			end: "bottom bottom",
			snap: {
				directional: false,
				snapTo: (progress: number) => {
					const closestIndex = Math.round(progress / step);
					const delta = (progress - closestIndex * step) / step;
					const threshold = 0.1;

					const targetIndex =
						Math.abs(delta) > threshold
							? closestIndex + (delta > 0 ? 1 : -1)
							: closestIndex;

					return gsap.utils.clamp(0, 1, targetIndex * step);
				},
				duration: { min: 0.2, max: 0.4 },
				delay: 0.03,
				ease: "power1.inOut"
			}
		});
	};

	const disableSnapping = () => {
		if (snapTrigger) {
			snapTrigger.kill();
			snapTrigger = null;
		}
	};

	window.performanceModeScroll = {
		...window.performanceModeScroll,
		enableSnap: enableSnapping,
		disableSnap: disableSnapping,
		refresh: () => {
			if (snapTrigger) snapTrigger.refresh();
		}
	};

	if (!window.__performanceModeEnabled) {
		enableSnapping();
	}

	// --- 4. Page Refresh / Load Corrections ---
	window.addEventListener(
		"load",
		() => {
			setTimeout(() => {
				ScrollTrigger.refresh();
			}, 100);
			const trigger = ScrollTrigger.getById("master-panel-scroll");
			if (trigger) updateSidebarVisuals(trigger.progress);
		},
		{ once: true }
	);

	window.addEventListener("startup:vanta", () => {
		if (snapTrigger) snapTrigger.refresh();
	});

	// --- 5. Resize Handling ---
	let isResizing = false;
	let resizeTimeout: number | null = null;
	let preResizeActiveIndex = 0;

	window.addEventListener("resize", () => {
		if (!isResizing) {
			isResizing = true;
			const scrollY = window.scrollY;
			const maxScroll = document.body.scrollHeight - window.innerHeight;
			const progressRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
			preResizeActiveIndex = Math.round(progressRatio / step);

			window.performanceModeScroll?.disableSnap?.();
		}

		if (resizeTimeout) window.clearTimeout(resizeTimeout);

		resizeTimeout = window.setTimeout(() => {
			isResizing = false;
			ScrollTrigger.refresh();

			const targetProgress = preResizeActiveIndex * step;
			const targetY = targetProgress * (document.body.scrollHeight - window.innerHeight);
			gsap.set(window, { scrollTo: { y: targetY } });

			if (!window.__performanceModeEnabled) {
				window.performanceModeScroll?.enableSnap?.();
			}
		}, 150);
	});

	// --- 6. Global Cleanup ---
	window.addEventListener(
		"beforeunload",
		() => {
			activeScrollTween?.kill();
			ScrollTrigger.getAll().forEach((t) => t.kill());
			window.performanceModeScroll = undefined;
		},
		{ once: true }
	);
}

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
