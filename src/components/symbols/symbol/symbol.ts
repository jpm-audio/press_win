import { Container, Sprite, Texture } from 'pixi.js';

export default class Symbol extends Container {
  protected _symbol: Sprite;
  protected _symbolType: string = '';

  public get symbolType() {
    return this._symbolType;
  }

  public set symbolType(symbolType: string) {
    this._symbolType = symbolType;
    this._symbol.texture = Texture.from(`${symbolType}.png`);
  }
  constructor(symbolType: string) {
    super();

    this._symbol = new Sprite();
    this._symbol.anchor.set(0.5);
    this.addChild(this._symbol);

    this.symbolType = symbolType;
  }

  public init() {}

  public reset() {}
}
