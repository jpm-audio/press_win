import { Color, Sprite } from 'pixi.js';
import createRadialGradientTexture from '../../utils/createRadialGradientTexture';
import { GAME_CONFIG } from '../../systems/game/config';
import Game from '../../systems/game/game';
import Scene from '../scene/scene';

export default class LoadingScene extends Scene {
  protected _background!: Sprite;

  public init() {
    // Background
    const backgroundRadius = Math.min(
      GAME_CONFIG.referenceSize.width,
      GAME_CONFIG.referenceSize.height
    );
    const bgTexture = createRadialGradientTexture(
      backgroundRadius * Game.game.assetsResolution,
      [
        { color: new Color(0x003b56), stop: 0 },
        { color: new Color(0x000000), stop: 1 },
      ]
    );
    this._background = Sprite.from(bgTexture);
    this._background.anchor.set(0.5);
    this._background.width = this._background.height = backgroundRadius;
    this._background.x = GAME_CONFIG.referenceSize.width / 2;
    this._background.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._background);

    // Logo
    const logo = Sprite.from('game_logo.png');
    logo.anchor.set(0.5);
    logo.x = GAME_CONFIG.referenceSize.width / 2;
    logo.y = (3 * GAME_CONFIG.referenceSize.height) / 8;
    this.addChild(logo);
  }
}
