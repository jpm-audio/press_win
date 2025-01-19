import { Sprite, Texture } from 'pixi.js';
import { CoinsAnimation } from '../particles/coins/coinsAnimation';
import { COINS_FOUNTAIN_PARTICLES_CONFIG } from '../particles/coins/configs/fountainConfig';
import FadeContainer from '../fadeContainer/fadeContainer';
import gsap from 'gsap';
import { SYMBOL_REDUCE_ANIMATION_OPTIONS } from '../symbols/symbol/config';
import waitForTickerTime from '../../utils/waitForTickerTime';
import Game from '../../systems/game/game';

export default class WinSymbol extends FadeContainer {
  protected _symbol: Sprite;
  protected _coinFountain: CoinsAnimation;

  constructor() {
    super();

    this._coinFountain = new CoinsAnimation(COINS_FOUNTAIN_PARTICLES_CONFIG);
    this.addChild(this._coinFountain);

    this._symbol = Sprite.from('s00.png');
    this._symbol.anchor.set(0.5);
    this._symbol.scale.set(0);
    this.addChild(this._symbol);
  }

  public async play(symbolId: string, duration: number = 3) {
    const showAnimationTime = 0.5;
    this._symbol.texture = Texture.from(`${symbolId}.png`);
    this._coinFountain.start();

    await gsap.to(this._symbol, {
      duration: showAnimationTime,
      ease: 'elastic.out(1,0.2)',
      pixi: {
        scaleX: 1,
        scaleY: 1,
      },
    });
    await gsap.to(this._symbol, {
      ...SYMBOL_REDUCE_ANIMATION_OPTIONS,
      ...{ duration: duration - showAnimationTime },
    });
    this._coinFountain.emitter.spawn = false;
    await waitForTickerTime(2000, Game.ticker);
    this._coinFountain.stop();
  }
}
