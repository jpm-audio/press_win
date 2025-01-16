import { TPixiElement } from '../../systems/game/types';
import { iAnimationTargetState } from './types';

export default class TweenAnimation {
  public animationProgress: number = 0;

  public updateElementProperties(
    element: TPixiElement,
    from: iAnimationTargetState,
    to: iAnimationTargetState
  ) {
    // Update position
    if (from.position !== undefined && to.position !== undefined) {
      const deltaX = to.position.x - from.position.x;
      const deltaY = to.position.y - from.position.y;
      element.position.set(
        from.position.x + deltaX * this.animationProgress,
        from.position.y + deltaY * this.animationProgress
      );
    }

    // Update scale
    if (from.scale !== undefined && to.scale !== undefined) {
      const deltaScale = to.scale - from.scale;
      element.scale.set(from.scale + deltaScale * this.animationProgress);
    }

    // Update rotation
    if (from.rotation !== undefined && to.rotation !== undefined) {
      const deltaRotation = to.rotation - from.rotation;
      element.rotation = from.rotation + deltaRotation * this.animationProgress;
    }

    // Update alpha
    if (from.alpha !== undefined && to.alpha !== undefined) {
      const deltaAlpha = to.alpha - from.alpha;
      element.alpha = from.alpha + deltaAlpha * this.animationProgress;
    }
  }

  public async start() {}
}
