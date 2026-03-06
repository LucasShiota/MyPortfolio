import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * ══════════════════════════════════════════════
 *  MASTER SCROLL MANAGER (Consolidated)
 * ══════════════════════════════════════════════
 * 
 * PURPOSE: Handles GSAP-based scroll behavior, including sidebar 
 * visual updates, snapping mechanisms, and hash synchronization.
 * 
 * DESIGN RULE (CRITICAL):
 * The 'sidebar-visuals' and 'snapping' triggers MUST remain separate.
 * - 'sidebar-visuals' uses scrub:0.5 and callbacks to update UI.
 * - 'snapping' MUST be a "naked" trigger (no scrub/callbacks) so GSAP can
 *   reliably detect native scroll velocity reaching zero to trigger snapping.
 * 
 * MERGING THESE TWO WILL BREAK AUTO-SNAP ON WHEEL/SCROLLBAR.
 */

// --- SHARED STATE ---
let _panels: HTMLElement[] = [];
let _totalSteps = 0;
let _step = 0;
let activeScrollTween: gsap.core.Tween | null = null;

const SIDEBAR_SCALE = { min: 1, max: 1.45, falloffRate: 1, falloffPower: 1.7 } as const;
const ICON_BASE_SCALE = 1;

// --- CONFIG HELPERS ---
const refreshPanelConfig = () => {
    _panels = gsap.utils.toArray<HTMLElement>(".panel");
    _totalSteps = _panels.length - 1;
    _step = _totalSteps > 0 ? 1 / _totalSteps : 1;
};

const getCurrentPanelIndex = () => {
	const scrollY = window.scrollY;
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const progressRatio = maxScroll > 0 ? scrollY / maxScroll : 0;
	return Math.round(progressRatio / _step);
};

const progressToScrollY = (progress: number) => {
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	return progress * maxScroll;
};

// --- VISUAL/STATE UPDATERS ---
function updateSidebarVisuals(progress: number) {
	const sidebar = document.querySelector<HTMLElement>(".sidebar");
	const navSections = document.querySelectorAll<HTMLElement>(".nav-section");
    const contactsEnterThreshold = gsap.utils.clamp(0, 1, 1 - _step * 0.5);

    // Toggle footer spacing
    if (sidebar) {
        sidebar.classList.toggle("contacts-entering", progress >= contactsEnterThreshold);
    }

	// Dynamic scaling
	const activeSectionPosition = progress * _totalSteps;
	navSections.forEach((sectionEl, sectionIndex) => {
		const sectionDistanceFromActive = Math.abs(sectionIndex - activeSectionPosition);
        
        // Exponential falloff for smooth scaling
		const falloff = Math.exp(
			-SIDEBAR_SCALE.falloffRate *
			Math.pow(sectionDistanceFromActive, SIDEBAR_SCALE.falloffPower)
		);
		const sectionScale = SIDEBAR_SCALE.min + (SIDEBAR_SCALE.max - SIDEBAR_SCALE.min) * falloff;
        
		sectionEl.style.transform = `scale(${sectionScale})`;

		const iconEl = sectionEl.querySelector<HTMLElement>(".navsec-icon");
		if (iconEl) {
			iconEl.style.transform = `translate(-50%, -50%) scale(${ICON_BASE_SCALE * sectionScale})`;
		}
	});
}

function updateHashSync(progress: number) {
	const panels = ["hello", "projects", "about", "contacts"];
	const index = Math.round(progress * (panels.length - 1));
	
	const currentHash = progress < 0.05 ? "" : `#${panels[index]}`;
	const newURL = currentHash === "" ? window.location.pathname : currentHash;
	
	if (window.location.hash !== currentHash) {
		history.replaceState(null, '', newURL);
	}
}

// --- CORE SCROLL CONTROLLER ---
export const initPanelScroll = () => {
    refreshPanelConfig();

	/**
	 * TRIGGER 1: Sidebar Visuals & Hash Sync
	 * Purpose: Smooth UI updates while scrolling.
	 * Modes: scrub: 0.5 (Smooth interpolation)
	 */
	ScrollTrigger.create({
		id: "sidebar-visuals",
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

	/**
	 * TRIGGER 2: Snapping (THE NAKED TRIGGER)
	 * Purpose: Correct scroll position to panel boundaries.
	 * Constraint: MUST NOT HAVE scrub or onUpdate/callbacks.
	 */
	let snapTrigger: ScrollTrigger | null = null;
    const isPerformanceMode = () => document.documentElement.classList.contains('performance-mode');

	const enableSnapping = () => {
		if (snapTrigger || _totalSteps <= 0) return;
		snapTrigger = ScrollTrigger.create({
			id: "snapping",
			trigger: document.body,
			start: "top top",
			end: "bottom bottom",
			snap: {
				directional: false,
				snapTo: (progress) => {
					const closestIndex = Math.round(progress / _step);
					const delta = (progress - closestIndex * _step) / _step;
					const threshold = 0.1; // Intent threshold

					const targetIndex =
						Math.abs(delta) > threshold
							? closestIndex + (delta > 0 ? 1 : -1)
							: closestIndex;

					return gsap.utils.clamp(0, 1, targetIndex * _step);
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

	// --- GLOBAL PERFORMANCE BRIDGE ---
	window.performanceModeScroll = {
		enableSnap: enableSnapping,
		disableSnap: disableSnapping,
		refresh: () => {
			ScrollTrigger.getById("sidebar-visuals")?.refresh();
			if (snapTrigger) snapTrigger.refresh();
		}
	};

	if (!window.__performanceModeEnabled) {
		enableSnapping();
	}

    // Refresh on vanta finish
    window.addEventListener("startup:vanta", () => {
        ScrollTrigger.getById("sidebar-visuals")?.refresh();
        if (snapTrigger) snapTrigger.refresh();
    });

	// --- MODULE INITIALIZATIONS ---
	initScrollNavigation();
	initScrollResize();
	initKeyboardScroll();
	initJumpToController();

	// --- CLEANUP ---
	window.addEventListener(
		"beforeunload",
		() => {
			activeScrollTween?.kill();
			ScrollTrigger.getAll().forEach((t) => t.kill());
			window.performanceModeScroll = undefined;
		},
		{ once: true }
	);
};

// --- NAVIGATION (Sidebar Clicks) ---
const initScrollNavigation = () => {
	const navSections = document.querySelectorAll<HTMLElement>(".nav-section");
	const SECTION_INDEX_STEP = 2; // Sync with SideBar.astro indexing (dots create offsets)

	const scrollToIndex = (index: number) => {
		if (_totalSteps <= 0) return;
		const clamped = gsap.utils.clamp(0, _totalSteps, index);
		const targetY = progressToScrollY(clamped * _step);

		activeScrollTween?.kill();
		activeScrollTween = gsap.to(window, {
			duration: 0.8,
			scrollTo: { y: targetY },
			ease: "power2.inOut"
		});
	};

	navSections.forEach((section) => {
		section.style.cursor = "pointer";
		section.addEventListener("click", () => {
			const navDataIndex = Number(section.dataset.index);
			if (Number.isNaN(navDataIndex)) return;
			const panelIndex = navDataIndex / SECTION_INDEX_STEP;
			scrollToIndex(panelIndex);
		});
	});
};

// --- KEYBOARD (Space/PgDown Snap) ---
export const initKeyboardScroll = () => {
	const SNAPPABLE_SELECTORS = [".panel", ".section-group", ".hero-section", ".project-section"];
	const HEADER_VAR = "--header-height";

	const getTargetElements = () => {
		return Array.from(document.querySelectorAll<HTMLElement>(SNAPPABLE_SELECTORS.join(",")))
			.map(el => ({
				el,
				top: el.getBoundingClientRect().top + window.scrollY
			}))
			.filter(({ el, top }) => {
				const rect = el.getBoundingClientRect();
				// Avoid nested sections causing multiple snaps
				if (el.classList.contains("project-section") && el.closest(".section-group")) {
					return false;
				}
				return rect.height > 20; 
			})
			.sort((a, b) => a.top - b.top);
	};

	const handleKeyboard = (e: KeyboardEvent) => {
		const isSpace = e.code === "Space";
		const isPageDown = e.code === "PageDown";
		const isPageUp = e.code === "PageUp";

		if (!isSpace && !isPageDown && !isPageUp) return;

		// Skip if user is typing
		const active = document.activeElement;
		if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).isContentEditable)) {
			return;
		}

		e.preventDefault();

		const isForward = isPageDown || (isSpace && !e.shiftKey);
		const scrollY = window.scrollY;
		const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue(HEADER_VAR)) || 0;
		const buffer = 20; // Intersection tolerance

		const targets = getTargetElements();
		if (targets.length === 0) return;

		let targetY = -1;
		if (isForward) {
			const next = targets.find((t) => t.top > scrollY + headerHeight + buffer);
			targetY = next ? next.top - headerHeight : document.documentElement.scrollHeight;
		} else {
			const prev = [...targets].reverse().find((t) => t.top < scrollY + headerHeight - buffer);
			targetY = prev ? prev.top - headerHeight : 0;
		}

		if (targetY !== -1) {
			gsap.to(window, {
				duration: 0.7,
				scrollTo: { y: targetY },
				ease: "power4.out"
			});
		}
	};

	window.addEventListener("keydown", handleKeyboard, { passive: false });
};

// --- RESIZE (Layout Correction) ---
const initScrollResize = () => {
	let isResizing = false;
	let resizeTimeout: number | null = null;
	let preResizeActiveIndex = 0;

	window.addEventListener("resize", () => {
		if (!isResizing) {
			isResizing = true;
			preResizeActiveIndex = getCurrentPanelIndex();
			window.performanceModeScroll?.disableSnap?.();
		}

		if (resizeTimeout) window.clearTimeout(resizeTimeout);
		
		resizeTimeout = window.setTimeout(() => {
			isResizing = false;
			refreshPanelConfig();
			ScrollTrigger.refresh();
			
			const targetY = progressToScrollY(preResizeActiveIndex * _step);
			gsap.set(window, { scrollTo: { y: targetY } });
			
			if (!window.__performanceModeEnabled) {
				window.performanceModeScroll?.enableSnap?.();
			}
		}, 150);
	});
};

// --- JUMP-TO MENU ---
export const initJumpToController = () => {
	const toggleBtn = document.getElementById('jump-toggle');
	const jumpNav = document.getElementById('jump-nav');

	if (!toggleBtn || !jumpNav) return;

	const closeJumpNav = () => {
		toggleBtn.setAttribute('aria-expanded', 'false');
		jumpNav.classList.remove('is-open');
	};

	toggleBtn.addEventListener('click', () => {
		const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
		toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
		jumpNav.classList.toggle('is-open');
	});

	jumpNav.querySelectorAll('.nav-link').forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth < 1024) closeJumpNav();
		});
	});

	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (!toggleBtn.contains(target) && !jumpNav.contains(target)) {
			if (window.innerWidth < 1024 && jumpNav.classList.contains('is-open')) closeJumpNav();
		}
	});
};

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
