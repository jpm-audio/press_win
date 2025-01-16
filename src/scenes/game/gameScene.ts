import { Color, Sprite } from 'pixi.js';
import Scene from '../scene/scene';
import { eGameSceneModes } from './types';
import gsap from 'gsap';
import SymbolsFrame from '../../components/symbols/frame/symbolsFrame';
import { GAME_CONFIG } from '../../systems/game/config';

export default class GameScene extends Scene {
  protected _background!: Sprite;
  protected _winBackground!: Sprite;
  protected _symbolsFrame!: SymbolsFrame;
  protected _mode: eGameSceneModes;

  constructor() {
    super();
    this._mode = eGameSceneModes.GAME;
  }

  public init() {
    this._id = 'Game Scene';
    // Background
    this._background = this._getBackground([
      { color: new Color(0x00fefe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(this._background);

    // Win Background
    this._winBackground = this._getBackground([
      { color: new Color(0xfe00fe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(this._winBackground);
    this._winBackground.alpha = 0;

    // Symbols Frame
    this._symbolsFrame = new SymbolsFrame().init();
    this._symbolsFrame.x = GAME_CONFIG.referenceSize.width / 2;
    this._symbolsFrame.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._symbolsFrame);

    return this;
  }

  public async modeTo(mode: eGameSceneModes, duration: number = 0.5) {
    if (this._mode !== mode) {
      // Change Background
      const currentBackground =
        this._mode === eGameSceneModes.GAME
          ? this._background
          : this._winBackground;
      const nextBackground =
        mode === eGameSceneModes.GAME ? this._background : this._winBackground;

      this._mode = mode;

      await gsap.to(currentBackground, {
        duration: duration,
        ease: 'power1.inOut',
        alpha: 0,
        onUpdate: () => {
          nextBackground.alpha = 1 - currentBackground.alpha;
        },
      });
    }
  }
}
