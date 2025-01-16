import { Container } from 'pixi.js';
import GiftBox from '../giftBox.ts/giftBox';

export default class SymbolsFrame extends Container {
  protected _giftBoxes: GiftBox[] = [];

  constructor() {
    super();
  }

  public init() {
    this._giftBoxes.push(new GiftBox());
    this.addChild(this._giftBoxes[0]);

    return this;
  }
}
