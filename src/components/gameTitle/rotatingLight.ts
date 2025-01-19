import { Sprite, Texture } from 'pixi.js';
import FadeContainer from '../fadeContainer/fadeContainer';
import gsap from 'gsap';

export default class RotatingLight extends FadeContainer {
  protected _light: Sprite;
  protected _rotationAnimation: gsap.core.Tween | null = null;

  constructor(texture: Texture) {
    super();

    this._light = Sprite.from(texture);
    this._light.blendMode = 'add';
    this._light.anchor.set(0.5);
    this.addChild(this._light);
  }

  public async startRotation(isClockwise: boolean = true) {
    if (this._rotationAnimation) {
      this._rotationAnimation.kill();
      this._rotationAnimation = null;
    }

    this.show();

    this._rotationAnimation = gsap.to(this._light, {
      duration: 6,
      ease: 'none',
      pixi: {
        rotation: 360 * (isClockwise ? 1 : -1),
      },
      repeat: -1,
      yoyo: false,
    });
    await this._rotationAnimation;
    this._rotationAnimation = null;
  }

  public async stopRotation() {
    console.log('stop rotation');
    await this.hide();
    if (this._rotationAnimation) {
      this._rotationAnimation.kill();
      this._rotationAnimation = null;
    }
  }
}
