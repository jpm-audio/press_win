export type TSignStart = 'minus' | 'plus';

export interface iShakeAnimationOptions {
  duration: number;
  easing: string;
  numMoves: number;
  maxRotation: number;
  rotationDecrement: number;
  signStart: TSignStart;
}
