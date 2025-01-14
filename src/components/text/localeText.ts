import { Text, TextOptions } from 'pixi.js';
import { Locale } from '../../systems/locale/locale';

export class LocaleText extends Text {
  protected _localeId!: string;

  public get localeId(): string {
    return this._localeId;
  }

  public set localeId(value: string) {
    this._localeId = value;
    this.text = value ? Locale.t(value) : value || '';
  }

  constructor(options: TextOptions) {
    super({
      text: options.text,
      style: options.style,
    });
    this.localeId = (options.text as string) || '';
  }
}
