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

export const GIFT_C2A_UP_ANIMATION_OPTIONS = {
  duration: 0.35,
  easing: 'power2.inOut',
  target: {
    from: {
      position: { x: 0, y: 0 },
    },
    to: {
      position: { x: 0, y: -100 },
    },
  },
  shadow: {
    from: {
      alpha: 1,
      scale: 1,
    },
    to: {
      alpha: 0.9,
      scale: 1.5,
    },
  },
};

export const GIFT_C2A_DOWN_ANIMATION_OPTIONS = {
  duration: 0.15,
  easing: 'power2.in',
  target: {
    from: {
      position: { x: 0, y: -100 },
    },
    to: {
      position: { x: 0, y: 0 },
    },
  },
  shadow: {
    from: {
      alpha: 0.9,
      scale: 1.5,
    },
    to: {
      alpha: 1,
      scale: 1,
    },
  },
};

export const GIFT_C2A_SHAKE_ANIMATION_OPTIONS: () => iShakeAnimationOptions =
  () => {
    const seed = Math.random();
    return {
      duration: 0.35,
      easing: 'power1.inOut',
      numMoves: 4,
      maxRotation: Math.PI / 18,
      rotationDecrement: 0.75,
      signStart: seed > 0.5 ? 'minus' : 'plus',
    };
  };

export const GIFT_HIDE_ANIMATION_OPTIONS = {
  duration: 0.35,
  easing: 'back.in(1.4)',
  target: {
    from: {
      position: { x: 0, y: 0 },
      scale: 1,
      alpha: 1,
    },
    to: {
      position: { x: 0, y: -50 },
      scale: 1.5,
      alpha: 0,
    },
  },
  shadow: {
    from: {
      alpha: 1,
      scale: 1,
    },
    to: {
      alpha: 0,
      scale: 2,
    },
  },
};
