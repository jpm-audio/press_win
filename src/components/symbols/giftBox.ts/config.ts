import { iFallDownAnimationOptions } from '../../../animations/fallDownAnimation/types';
import { iShakeAnimationOptions } from '../../../animations/shakeAnimation/types';

export const GIFT_BOX_SHOW_ANIMATION_OPTIONS: iFallDownAnimationOptions = {
  duration: 0.5,
  easing: 'power1.in',
  target: {
    from: {
      position: { x: 0, y: -1000 },
      alpha: 0,
      scale: 1,
    },
    to: {
      position: { x: 0, y: 0 },
      alpha: 1,
      scale: 1,
    },
  },
  shadow: {
    from: {
      alpha: 0,
      scale: 4,
    },
    to: {
      alpha: 0.5,
      scale: 1,
    },
  },
};

export const GIFT_BOX_SHAKE_ANIMATION_OPTIONS: () => iShakeAnimationOptions =
  () => {
    const seed = Math.random();
    return {
      duration: 0.15 + seed * 0.3,
      easing: 'power1.inOut',
      numMoves: 2 + Math.floor(seed * 8),
      maxRotation: (seed * Math.PI) / 25,
      rotationDecrement: (1 - seed) * 0.5,
      signStart: Math.random() > 0.5 ? 'minus' : 'plus',
    };
  };
