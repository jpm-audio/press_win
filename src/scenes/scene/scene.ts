import gsap from 'gsap';
import { Color, Container, Sprite } from 'pixi.js';
import { GAME_CONFIG } from '../../systems/game/config';
import createRadialGradientTexture from '../../utils/createRadialGradientTexture';
import Game from '../../systems/game/game';

export default class Scene extends Container {
  protected _id: string = '';
  public closeTime: number = 0.5;
  public openTime: number = 0.5;

  public get id() {
    return this._id;
  }

  constructor() {
    super();
    this.alpha = 0;
  }

  protected _getBackground(
    colorStops: {
      color: Color;
      stop: number;
    }[]
  ) {
    // Background
    const backgroundRadius = Math.max(
      GAME_CONFIG.referenceSize.width,
      GAME_CONFIG.referenceSize.height
    );
    const bgTexture = createRadialGradientTexture(
      backgroundRadius * Game.game.assetsResolution,
      colorStops
    );
    const background = Sprite.from(bgTexture);
    background.anchor.set(0.5);
    background.width = background.height = backgroundRadius;
    background.x = GAME_CONFIG.referenceSize.width / 2;
    background.y = GAME_CONFIG.referenceSize.height / 2;
    return background;
  }

  public async close() {
    await gsap.to(this, {
      duration: this.closeTime,
      alpha: 0,
      ease: 'power1.in',
    });
  }

  public async open() {
    await gsap.to(this, {
      duration: this.openTime,
      alpha: 1,
      ease: 'power1.in',
    });
  }

  public onScreenResize(_drawFrame: { width: number; height: number }) {}
}
