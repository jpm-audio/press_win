import { Container, Point, Sprite } from 'pixi.js';
import TextureFactory from '../../textures/textureFactory';
import {
  GIFT_BOX_SHAKE_ANIMATION_OPTIONS,
  GIFT_BOX_SHOW_ANIMATION_OPTIONS,
} from './config';
import FallDownAnimation from '../../../animations/fallDownAnimation/fallDownAnimation';
import ShakeAnimation from '../../../animations/shakeAnimation/shakeAnimation';

export default class GiftBox extends Container {
  protected _shadow: Sprite;
  protected _giftBox: Sprite;
  protected _showAnimation!: FallDownAnimation;
  protected _shakeAnimation!: ShakeAnimation;
  protected _settings = {
    shadow: {
      position: new Point(0, 50),
      alpha: 0.5,
    },
  };

  constructor() {
    super();

    this._shadow = new Sprite(TextureFactory.giftBoxShadow());
    this._shadow.anchor.set(0.5);
    this._shadow.position.copyFrom(this._settings.shadow.position);
    this._shadow.alpha = this._settings.shadow.alpha;
    this.addChild(this._shadow);

    this._giftBox = Sprite.from('s11.png');
    this._giftBox.anchor.set(0.5);
    this.addChild(this._giftBox);

    this._showAnimation = new FallDownAnimation(
      this._giftBox,
      this._shadow,
      GIFT_BOX_SHOW_ANIMATION_OPTIONS
    );

    this._shakeAnimation = new ShakeAnimation(
      this._giftBox,
      GIFT_BOX_SHAKE_ANIMATION_OPTIONS()
    );
  }

  public async show() {
    this._shakeAnimation.options = GIFT_BOX_SHAKE_ANIMATION_OPTIONS();

    await this._showAnimation.start();
    await this._shakeAnimation.start();
  }
}
