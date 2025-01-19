export const SYMBOL_SHOW_ANIMATION_OPTIONS = {
  duration: 0.5,
  pixi: {
    scaleX: 1,
    scaleY: 1,
  },
  ease: 'back.out(1.7)',
};

export const SYMBOL_HIDE_ANIMATION_OPTIONS = {
  duration: 0.5,
  pixi: {
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
  },
  ease: 'elastic.in(1,0.5)',
};

export const SHINE_ANIMATION_OPTIONS = {
  duration: 0.5,
  pixi: {
    scaleX: 4,
    scaleY: 6,
    alpha: 1,
  },
  ease: 'power1.in',
};

export const SYMBOL_FLOATING_ANIMATION_OPTIONS = () => {
  return {
    duration: 2,
    easing: 'sine.inOut',
    maxAmplitude: 15,
    signStart: Math.random() > 0.5 ? 'minus' : 'plus',
  };
};
