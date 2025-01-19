import { LocaleText } from '../text/localeText';
import { iMessageBoxOptions } from './types';
import FadeContainer from '../fadeContainer/fadeContainer';
import { Locale } from '../../systems/locale/locale';

export default class MessageBox extends FadeContainer {
  protected _text: LocaleText;
  protected _currentTween: gsap.core.Tween | null = null;

  public get textEl() {
    return this._text;
  }

  constructor(options: iMessageBoxOptions) {
    super();

    if (options.showAnimationVars) {
      this.showAnimationVars = {
        ...this.showAnimationVars,
        ...options.showAnimationVars,
      };
    }

    if (options.hideAnimationVars) {
      this.hideAnimationVars = {
        ...this.hideAnimationVars,
        ...options.hideAnimationVars,
      };
    }

    this._text = new LocaleText(options.textOptions);
    this._text.anchor.set(0.5);
    this.addChild(this._text);
  }

  public async setText(text: string) {
    console.error('setText', text);
    await this.hide();
    this._text.localeId = text;
    await this.show();
  }

  public async setTextWidthValue(
    text: string,
    value?: { [key: string]: string }
  ) {
    await this.hide();
    const localeText = Locale.t(text, value);
    this._text.localeId = localeText as string;
    await this.show();
  }
}
