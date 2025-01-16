import gsap from 'gsap';
import { TPixiElement } from '../../systems/game/types';
import TweenAnimation from '../animation/tweenAnimation';
import { iFallDownAnimationOptions } from './types';

export default class FallDownAnimation extends TweenAnimation {
  public options: iFallDownAnimationOptions;
  public target: TPixiElement;
  public shadow: TPixiElement;

  constructor(
    target: TPixiElement,
    shadow: TPixiElement,
    options: iFallDownAnimationOptions
  ) {
    super();
    this.target = target;
    this.shadow = shadow;
    this.options = options;
  }

  public async start() {
    this.animationProgress = 0;

    await gsap.to(this, {
      duration: this.options.duration,
      ease: this.options.easing,
      pixi: {
        animationProgress: 1,
      },
      onUpdate: () => {
        this.updateElementProperties(
          this.target,
          this.options.target.from,
          this.options.target.to
        );
        this.updateElementProperties(
          this.shadow,
          this.options.shadow.from,
          this.options.shadow.to
        );
      },
    });
  }
}
