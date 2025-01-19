import { Sprite, Texture } from 'pixi.js';
import FadeContainer from '../fadeContainer/fadeContainer';
import RotatingLight from './rotatingLight';

export default class GameTitle extends FadeContainer {
  protected _backLight: RotatingLight;
  protected _frontLight: RotatingLight;
  protected _title: Sprite;

  constructor(title: Texture) {
    super();

    this._backLight = new RotatingLight(Texture.from('rotated_glow.png'));
    this._backLight.scale.set(1.5);
    this._backLight.alpha = 0;
    this._backLight.visible = false;
    this.addChild(this._backLight);

    this._title = new Sprite(title);
    this._title.anchor.set(0.5);
    this.addChild(this._title);

    this._frontLight = new RotatingLight(Texture.from('rotated_glow.png'));
    this._frontLight.scale.set(1.5);
    this._frontLight.alpha = 0;
    this._frontLight.visible = false;
    this.addChild(this._frontLight);
  }

  public async playWin() {
    this._backLight.startRotation(true);
    this._frontLight.startRotation(false);
  }

  public async playNormal() {
    this._backLight.stopRotation();
    await this._frontLight.stopRotation();
  }
}
