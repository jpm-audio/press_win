import { Container, Point, Rectangle, Sprite } from 'pixi.js';
import TextureFactory from '../../textures/textureFactory';
import {
  GIFT_BOX_SHAKE_ANIMATION_OPTIONS,
  GIFT_BOX_SHOW_ANIMATION_OPTIONS,
  GIFT_C2A_DOWN_ANIMATION_OPTIONS,
  GIFT_C2A_SHAKE_ANIMATION_OPTIONS,
  GIFT_C2A_UP_ANIMATION_OPTIONS,
  GIFT_HIDE_ANIMATION_OPTIONS,
} from './config';
import TargetShadowAnimation from '../../../animations/targetShadowAnimation/targetShadowAnimation';
import ShakeAnimation from '../../../animations/shakeAnimation/shakeAnimation';
import { SmokeAnimation } from '../../particles/smoke/smokeAnimation';
import waitForTickerTime from '../../../utils/waitForTickerTime';
import { SMOKE_PARTICLES_CONFIG } from '../../particles/smoke/configs/smokeConfig';
import Game from '../../../systems/game/game';
import gsap from 'gsap';
import { eGiftBoxEvents } from './types';

export default class GiftBox extends Container {
  protected _shadow: Sprite;
  protected _giftBox: Sprite;
  protected _shine: Sprite;
  protected _moveAnimation!: TargetShadowAnimation;
  protected _shakeAnimation!: ShakeAnimation;
  protected _smokeAnimation!: SmokeAnimation;
  protected _settings = {
    shadow: {
      position: new Point(0, 50),
      alpha: 0.5,
    },
  };

  constructor() {
    super();

    // Create all the elements
    this._shadow = new Sprite(TextureFactory.giftBoxShadow());
    this._shadow.anchor.set(0.5);
    this._shadow.position.copyFrom(this._settings.shadow.position);
    this._shadow.alpha = 0;
    this.addChild(this._shadow);

    this._giftBox = Sprite.from('s11.png');
    this._giftBox.alpha = 0;
    this._giftBox.anchor.set(0.5);
    this.addChild(this._giftBox);

    this._smokeAnimation = new SmokeAnimation();
    this.addChild(this._smokeAnimation);

    this._shine = Sprite.from('shine.png');
    this._shine.anchor.set(0.5);
    this._shine.alpha = 0;
    this._shine.scale.set(0);
    this._shine.blendMode = 'add';
    this.addChild(this._shine);

    // Create and set the animations
    this._moveAnimation = new TargetShadowAnimation(
      this._giftBox,
      this._shadow,
      GIFT_BOX_SHOW_ANIMATION_OPTIONS
    );

    this._shakeAnimation = new ShakeAnimation(
      this._giftBox,
      GIFT_BOX_SHAKE_ANIMATION_OPTIONS()
    );

    // Events:
    // a - Set the hit are for the interaction
    // b - Set the press event listener
    const hitFrame = new Rectangle(-80, -80, 160, 160);
    this._giftBox.hitArea = hitFrame;
    this._giftBox.on('pointerdown', () => this._onPress());
  }

  /**
   * GiftBox Exploding animation
   */
  protected async _boxExplodes() {
    this._moveAnimation.options = GIFT_HIDE_ANIMATION_OPTIONS;
    const movePromise = this._moveAnimation.start();

    this._shine.alpha = 1;
    this._shine.scale.set(0);
    const shinePromise = gsap.to(this._shine, {
      duration: 0.5,
      pixi: {
        scaleX: 4,
        scaleY: 8,
        alpha: 0,
      },
      ease: 'power1.inOut',
    });

    await Promise.all([movePromise, shinePromise]);

    this.emit(eGiftBoxEvents.SHOWN);
  }

  /**
   * Event listener for player press action handling
   */
  protected _onPress() {
    this.emit(eGiftBoxEvents.PRESS);
  }

  /**
   * Shows the GiftBox by its animation, falling down.
   */
  public async fallDown() {
    this._shakeAnimation.options = GIFT_BOX_SHAKE_ANIMATION_OPTIONS();
    this._moveAnimation.options = GIFT_BOX_SHOW_ANIMATION_OPTIONS;
    await this._moveAnimation.start();
    await this._shakeAnimation.start();
    this.enable();
  }

  public async callToAction() {
    this._moveAnimation.options = GIFT_C2A_UP_ANIMATION_OPTIONS;
    this._shakeAnimation.options = GIFT_C2A_SHAKE_ANIMATION_OPTIONS();

    this._shakeAnimation.start();
    await this._moveAnimation.start();

    this._moveAnimation.options = GIFT_C2A_DOWN_ANIMATION_OPTIONS;
    await this._moveAnimation.start();
  }

  /**
   * Explodes the GiftBox by its animation in a cloud of smoke
   */
  public async explode() {
    this.disable();

    // Box Explode
    this._boxExplodes();

    await waitForTickerTime(100, Game.ticker);

    // Smoke
    this._smokeAnimation.start();

    await waitForTickerTime(
      (SMOKE_PARTICLES_CONFIG.spawnOptions.lifespan as number) * 1500,
      Game.ticker
    );

    // End
    this._smokeAnimation.stop();

    this.emit(eGiftBoxEvents.HIDDEN);
  }

  /**
   * Enables the GiftBox interaction
   */
  public enable() {
    this._giftBox.eventMode = 'static';
    this._giftBox.cursor = 'pointer';
  }

  /**
   * Disables the GiftBox interaction
   */
  public disable() {
    this._giftBox.eventMode = 'none';
    this._giftBox.cursor = 'default';
  }
}
