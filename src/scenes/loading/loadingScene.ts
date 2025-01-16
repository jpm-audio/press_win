import { Color, Container, FillGradient, Graphics, Sprite } from 'pixi.js';
import { GAME_CONFIG } from '../../systems/game/config';
import Scene from '../scene/scene';
import gsap from 'gsap';
import { LocaleText } from '../../components/text/localeText';
import ButtonFactory from '../../components/buttons/buttonFactory';
import DefaultButtonBuilder from '../../components/buttons/defaultButton/defaultButtonBulder';

export default class LoadingScene extends Scene {
  protected _background!: Sprite;
  protected _loadingContainer!: Container;
  protected _loadingBar!: Graphics;
  protected _currentLoadingAnimation: gsap.core.Tween | null = null;
  public percentage = 0;
  public barWidth = 330;
  public barHeight = 5;

  public init() {
    this._id = 'Loading Scene';

    // Background
    this._background = this._getBackground([
      { color: new Color(0x003b56), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(this._background);

    // Logo
    const logo = Sprite.from('game_logo.png');
    logo.anchor.set(0.5);
    logo.x = GAME_CONFIG.referenceSize.width / 2;
    logo.y = (3 * GAME_CONFIG.referenceSize.height) / 8;
    this.addChild(logo);

    this._loadingContainer = new Container();
    this.addChild(this._loadingContainer);

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
    this._loadingContainer.addChild(loadingText);

    // Loading Bar
    const loadingBarBg = new Graphics();
    loadingBarBg.rect(0, 0, this.barWidth, this.barHeight);
    loadingBarBg.fill(0x000000);
    loadingBarBg.stroke({ color: 0xffffff, width: 1, alpha: 0.15 });

    this._loadingContainer.addChild(loadingBarBg);

    this._loadingBar = new Graphics();
    this._loadingContainer.addChild(this._loadingBar);

    loadingBarBg.x = this._loadingBar.x =
      (GAME_CONFIG.referenceSize.width - this.barWidth) / 2;
    loadingBarBg.y = this._loadingBar.y = 470;
  }

  public async progressTo(value: number, duration: number = 1) {
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
    if (this._currentLoadingAnimation) {
      await this._currentLoadingAnimation;
    }
    // Remove the loading bar
    this._loadingContainer.visible = false;

    // Add the start button
    const startButton = ButtonFactory.button({
      buttonBuilder: new DefaultButtonBuilder(),
      text: 'startButton',
      width: 200,
      height: 50,
    });

    startButton.x = GAME_CONFIG.referenceSize.width / 2;
    startButton.y = 450;
    this.addChild(startButton);

    await new Promise((resolve) => {
      const onPress = () => {
        resolve(null);
        startButton.off('pointerup', onPress, this);
        this.removeChild(startButton);
      };
      startButton.on('pointerup', onPress, this);
    });

    return;
  }
}
