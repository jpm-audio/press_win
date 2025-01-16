import gsap from 'gsap';
import { TPixiElement } from '../../systems/game/types';
import TweenAnimation from '../animation/tweenAnimation';
import { iShakeAnimationOptions } from './types';

export default class ShakeAnimation extends TweenAnimation {
  public options: iShakeAnimationOptions;
  public target: TPixiElement;
  public axisPercentage = {
    x: 1,
    y: 0,
  };
  public signStart: 'minus' | 'plus' | 'random' = 'random';

  constructor(target: TPixiElement, options: iShakeAnimationOptions) {
    super();
    this.target = target;
    this.options = options;
  }

  public async start() {
    let sign = this.options.signStart === 'minus' ? -1 : 1;
    let rotation = this.options.maxRotation;
    const duration = this.options.duration / this.options.numMoves;

    for (let i = 0; i < this.options.numMoves; i++) {
      await gsap.to(this.target, {
        duration,
        rotation: sign * rotation,
      });

      sign *= -1;

      if (i === this.options.numMoves - 2) {
        rotation = 0;
      } else {
        rotation *= this.options.rotationDecrement;
      }
    }
  }
}
