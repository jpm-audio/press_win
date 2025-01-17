import { iAnimationTargetState } from '../animation/types';

export interface iTargetShadowAnimationOptions {
  duration: number;
  easing: string;
  target: {
    from: iAnimationTargetState;
    to: iAnimationTargetState;
  };
  shadow: {
    from: iAnimationTargetState;
    to: iAnimationTargetState;
  };
}
