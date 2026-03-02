/**
 * Project Slider Physics Engine
 * Handles lerp-based smooth scrolling, inertia, and snapping.
 */
export class ProjectSliderPhysics {
  private container: HTMLElement;
  private lerpRafId: number | null = null;
  private stiffness = 0.1;
  private precision = 0.5;

  public currentScroll = 0;
  public targetScroll = 0;
  public isDragging = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentScroll = container.scrollLeft;
    this.targetScroll = container.scrollLeft;
  }

  public startLerp(onUpdate?: (scroll: number) => void): void {
    if (this.lerpRafId || this.isDragging) return;
    
    const update = () => {
      if (this.isDragging) {
        this.lerpRafId = null;
        return;
      }

      const maxScrollLeft = this.container.scrollWidth - this.container.clientWidth;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScrollLeft));

      const diff = this.targetScroll - this.currentScroll;
      this.currentScroll += diff * this.stiffness;

      if (Math.abs(diff) > this.precision) {
        this.container.scrollLeft = this.currentScroll;
        if (onUpdate) onUpdate(this.currentScroll);
        this.lerpRafId = requestAnimationFrame(update);
      } else {
        this.currentScroll = this.targetScroll;
        this.container.scrollLeft = this.currentScroll;
        if (onUpdate) onUpdate(this.currentScroll);
        this.lerpRafId = null;
      }
    };

    this.lerpRafId = requestAnimationFrame(update);
  }

  public stopLerp(): void {
    if (this.lerpRafId) {
      cancelAnimationFrame(this.lerpRafId);
      this.lerpRafId = null;
    }
  }

  public scrollTo(position: number, instant = false): void {
    this.targetScroll = position;
    if (instant) {
      this.stopLerp();
      this.currentScroll = position;
      this.container.scrollLeft = position;
    } else {
      this.startLerp();
    }
  }

  public applyDelta(delta: number): void {
    this.targetScroll += delta;
    this.startLerp();
  }
}
