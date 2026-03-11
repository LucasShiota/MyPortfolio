import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register ScrollToPlugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * Project Slider Physics Engine (GSAP Edition)
 * Handles smooth scrolling, inertia, and snapping using GSAP's optimized engine.
 */
export class ProjectSliderPhysics {
  private container: HTMLElement;
  public currentScroll = 0;
  public targetScroll = 0;
  public isDragging = false;
  private tween: gsap.core.Tween | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentScroll = container.scrollLeft;
    this.targetScroll = container.scrollLeft;
  }

  /**
   * Stop any active GSAP animations.
   */
  public stopLerp(): void {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
  }

  /**
   * Scroll to a specific position using GSAP.
   */
  public scrollTo(position: number, instant = false): void {
    const maxScroll = this.container.scrollWidth - this.container.clientWidth;
    const clampedPos = Math.max(0, Math.min(position, maxScroll));

    this.targetScroll = clampedPos;

    if (instant) {
      this.stopLerp();
      this.currentScroll = clampedPos;
      this.container.scrollLeft = clampedPos;
    } else {
      this.stopLerp();
      this.tween = gsap.to(this.container, {
        scrollTo: { x: clampedPos },
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          this.currentScroll = this.container.scrollLeft;
        },
        onComplete: () => {
          this.tween = null;
        },
      });
    }
  }

  /**
   * Apply delta movement (used for wheel events).
   */
  public applyDelta(delta: number): void {
    this.targetScroll += delta;
    this.scrollTo(this.targetScroll);
  }

  /**
   * Synchronize internal scroll state with the container.
   * Call this when dragging manually.
   */
  public syncState(): void {
    this.currentScroll = this.container.scrollLeft;
    this.targetScroll = this.currentScroll;
  }
}
