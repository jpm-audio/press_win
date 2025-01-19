export const SYMBOL_SHOW_ANIMATION_OPTIONS = {
  duration: 0.5,
  pixi: {
    scaleX: 1,
    scaleY: 1,
  },
  ease: 'elastic.out(1,0.2)',
};

export const SYMBOL_DISOLVE_ANIMATION_OPTIONS = {
  duration: 1,
  pixi: {
    alpha: 0,
  },
  ease: 'circ.in',
};

export const SYMBOL_EXPLODE_ANIMATION_OPTIONS = {
  duration: 0.15,
  pixi: {
    scaleX: 2,
    scaleY: 2,
    alpha: 0,
  },
  ease: 'power2.in',
};

export const SYMBOL_REDUCE_ANIMATION_OPTIONS = {
  duration: 1,
  pixi: {
    scaleX: 0,
    scaleY: 0,
  },
  ease: 'expo.in',
};

export const SHINE_ANIMATION_OPTIONS = {
  duration: 0.25,
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
