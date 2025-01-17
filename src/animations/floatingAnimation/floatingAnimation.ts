import gsap from 'gsap';
import { TPixiElement } from '../../systems/game/types';
import TweenAnimation from '../animation/tweenAnimation';
import { iFloatingAnimationOptions, TSignStart } from './types';

export default class FloatingAnimation extends TweenAnimation {
  protected _currentTween: gsap.core.Tween | null = null;
  public options: iFloatingAnimationOptions;
  public target: TPixiElement;
  public axisPercentage = {
    x: 1,
    y: 0,
  };
  public signStart: TSignStart = 'minus';

  constructor(target: TPixiElement, options: iFloatingAnimationOptions) {
    super();
    this.target = target;
    this.options = options;
  }

  public async start() {
    if (this._currentTween) this._currentTween.kill();

    let sign = this.options.signStart === 'minus' ? -1 : 1;

    // Move to one oscilation side
    await gsap.to(this.target, {
      duration: this.options.duration / 2,
      pixi: {
        y: sign * this.options.maxAmplitude,
      },
      ease: this.options.easing,
    });

    sign *= -1;

    // Start oscilation loop
    this._currentTween = gsap.to(this.target, {
      duration: this.options.duration,
      pixi: {
        y: sign * this.options.maxAmplitude,
      },
      ease: this.options.easing,
      yoyoEase: this.options.easing,
      repeat: -1,
      yoyo: true,
    });

    await this._currentTween;
  }

  public async stop() {
    if (this._currentTween) this._currentTween.kill();
    this._currentTween = null;

    await gsap.to(this.target, {
      duration: this.options.duration,
      pixi: {
        y: 0,
      },
      ease: this.options.easing,
    });
  }
}
