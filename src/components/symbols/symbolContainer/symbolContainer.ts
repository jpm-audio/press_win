import { Container } from 'pixi.js';
import GiftBox from '../giftBox.ts/giftBox';
import SymbolFactory from '../symbol/symbolFactory';

export default class SymbolContainer extends Container {
  protected _symbolLayer: Container;
  protected _giftBox: GiftBox;

  constructor() {
    super();
    this._symbolLayer = new Container();
    this._symbolLayer.alpha = 0;
    this.addChild(this._symbolLayer);

    this._giftBox = new GiftBox();
    this.addChild(this._giftBox);
  }

  public setSymbol(symbolType: string) {
    const symbol = SymbolFactory.get(symbolType);
    this._symbolLayer.addChild(symbol);
  }

  public async show() {
    await this._giftBox.show();
  }
}
