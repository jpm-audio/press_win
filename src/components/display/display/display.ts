import { BitmapText, Container, Text } from 'pixi.js';
import { TDisplayValueParser } from './types';

export default class Display extends Container {
  protected _content: Text | BitmapText;
  public valueParser: TDisplayValueParser;

  public set text(value: number) {
    this._content.text = this.valueParser(value);
  }

  constructor(
    content: Text | BitmapText,
    valueParser: TDisplayValueParser = (value) => value.toString()
  ) {
    super();
    this.valueParser = valueParser;
    this._content = content;
    this._content.anchor.set(0.5);
    this.addChild(content);
  }
}
