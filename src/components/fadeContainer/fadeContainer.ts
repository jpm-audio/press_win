import gsap from 'gsap';
import { Container, PointData } from 'pixi.js';

/**
 * FadeContainer
 *
 * A container that fades in and out
 */
export default class FadeContainer extends Container {
  protected _currentFadeAnimation: gsap.core.Tween | null = null;
  protected _currentPositionAnimation: gsap.core.Tween | null = null;

  public showAnimationVars: gsap.TweenVars = {
    duration: 0.5,
    ease: 'power1.in',
    pixi: { alpha: 1 },
  };
  public hideAnimationVars: gsap.TweenVars = {
    duration: 0.5,
    ease: 'power1.out',
    pixi: { alpha: 0 },
  };

  public async show() {
    if (this._currentFadeAnimation) this._currentFadeAnimation.kill();
    if (this.visible && this.alpha === 1) return;

    this.visible = true;
    this._currentFadeAnimation = gsap.to(this, this.showAnimationVars);

    await this._currentFadeAnimation;
    this._currentFadeAnimation = null;
  }

  public async hide() {
    if (this._currentFadeAnimation) this._currentFadeAnimation.kill();
    if (!this.visible || this.alpha === 0) return;

    this._currentFadeAnimation = gsap.to(this, this.hideAnimationVars);
    await this._currentFadeAnimation;
    this._currentFadeAnimation = null;
    this.visible = false;
  }

  public async positionTo(
    position: PointData,
    duration: number = 0.5,
    ease: string = 'power1.inOut'
  ) {
    await gsap.to(this, {
      duration,
      ease,
      pixi: {
        x: position.x,
        y: position.y,
      },
    });
  }

  public reset() {
    if (this._currentFadeAnimation) {
      this._currentFadeAnimation.kill();
      this._currentFadeAnimation = null;
    }

    this.visible = true;
    this.alpha = 1;
  }
}
