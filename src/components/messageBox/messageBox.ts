import { Container } from 'pixi.js';
import { LocaleText } from '../text/localeText';
import { iMessageBoxOptions } from './types';
import gsap from 'gsap';

export default class MessageBox extends Container {
  protected _text: LocaleText;
  protected _currentTween: gsap.core.Tween | null = null;
  public options: iMessageBoxOptions;

  constructor(options: iMessageBoxOptions) {
    super();
    this.options = options;

    console.log(this.options.textOptions);

    this._text = new LocaleText(this.options.textOptions);
    this._text.anchor.set(0.5);
    this.addChild(this._text);
  }

  public async setText(text: string) {
    const isShown = this.alpha === 1;
    if (isShown) await this.hide();
    this._text.localeId = text;
    if (isShown) await this.show();
  }

  public async show() {
    if (this.alpha === 1) return;
    if (this._currentTween !== null) this._currentTween.kill();

    this._currentTween = gsap.to(this, {
      duration: this.options.showTime,
      alpha: 1,
      ease: 'power1.in',
    });
    await this._currentTween;
    this._currentTween = null;
  }

  public async hide() {
    if (this.alpha === 0) return;
    if (this._currentTween !== null) this._currentTween.kill();

    this._currentTween = gsap.to(this, {
      duration: this.options.hideTime,
      alpha: 0,
      ease: 'power1.in',
    });
    await this._currentTween;
    this._currentTween = null;
  }
}
