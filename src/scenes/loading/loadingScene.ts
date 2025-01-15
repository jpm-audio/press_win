import { Color, FillGradient, Graphics, Sprite } from 'pixi.js';
import createRadialGradientTexture from '../../utils/createRadialGradientTexture';
import { GAME_CONFIG } from '../../systems/game/config';
import Game from '../../systems/game/game';
import Scene from '../scene/scene';
import gsap from 'gsap';
import { LocaleText } from '../../components/text/localeText';

export default class LoadingScene extends Scene {
  protected _background!: Sprite;
  protected _loadingBar!: Graphics;
  protected _currentLoadingAnimation: gsap.core.Tween | null = null;
  public percentage = 0;
  public barWidth = 330;
  public barHeight = 5;

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

    // Loading Text
    const loadingText = new LocaleText({
      text: 'loading',
      style: {
        fontFamily: 'Do Hyeon',
        fontSize: 34,
        fill: 0xffffff,
      },
    });
    loadingText.anchor.set(0.5);
    loadingText.x = GAME_CONFIG.referenceSize.width / 2;
    loadingText.y = 430;
    this.addChild(loadingText);

    // Loading Bar
    const bgBar = new Graphics();
    bgBar.rect(0, 0, this.barWidth, this.barHeight);
    bgBar.fill(0x000000);
    bgBar.stroke({ color: 0xffffff, width: 1, alpha: 0.15 });

    this.addChild(bgBar);

    this._loadingBar = new Graphics();
    this.addChild(this._loadingBar);

    bgBar.x = this._loadingBar.x =
      (GAME_CONFIG.referenceSize.width - this.barWidth) / 2;
    bgBar.y = this._loadingBar.y = 470;
  }

  public async progressTo(value: number, duration: number = 2) {
    console.log('progress: ', value);
    if (this._currentLoadingAnimation) {
      this._currentLoadingAnimation.kill();
    }

    this._currentLoadingAnimation = gsap.to(this, {
      duration: duration,
      ease: 'power2.inOut',
      pixi: {
        percentage: value,
      },
      onUpdate: () => this.setProgress(this.percentage),
    });

    await this._currentLoadingAnimation;
    this._currentLoadingAnimation = null;
  }

  public setProgress(value: number) {
    const width = this.barWidth * value;
    const gradientFill = new FillGradient(0, 0, width, this.barHeight);
    gradientFill.addColorStop(0, 0x00ffff);
    gradientFill.addColorStop(1, 0xffffff);

    this._loadingBar.clear();
    this._loadingBar.rect(0, 0, width, this.barHeight);

    this._loadingBar.fill(gradientFill);

    this.percentage = value;
  }

  public async waitForStartAction() {
    return;
  }
}
