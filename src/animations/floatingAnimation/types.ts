export type TSignStart = 'minus' | 'plus';

export interface iFloatingAnimationOptions {
  duration: number;
  easing: string;
  maxAmplitude: number;
  signStart: TSignStart;
}
