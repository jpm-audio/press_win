import { Container } from 'pixi.js';
import GiftBox from '../giftBox/giftBox';
import SymbolFactory from '../symbol/symbolFactory';
import { eGiftBoxEvents } from '../giftBox/types';
import waitForTickerTime from '../../../utils/waitForTickerTime';
import Game from '../../../systems/game/game';
import Symbol from '../symbol/symbol';
import { eSymbolContainerEvents, eSymbolContainerStates } from './types';

export default class SymbolContainer extends Container {
  protected _symbolLayer: Container;
  protected _giftBox: GiftBox;
  protected _symbol!: Symbol;
  protected _currentState: eSymbolContainerStates =
    eSymbolContainerStates.REMOVED;

  public get state() {
    return this._currentState;
  }

  public set state(state: eSymbolContainerStates) {
    this._currentState = state;
    this.emit(eSymbolContainerEvents.STATE_CHANGED, this._currentState);
  }

  constructor() {
    super();
    this._symbolLayer = new Container();
    this._symbolLayer.alpha = 0;
    this.addChild(this._symbolLayer);

    this._giftBox = new GiftBox();
    this._giftBox.on(eGiftBoxEvents.PRESS, () => this.revealSymbol());
    this.addChild(this._giftBox);
  }

  public async revealSymbol() {
    this.state = eSymbolContainerStates.REVEALING;

    const giftBoxHidePromise = this._giftBox.hide();

    await waitForTickerTime(250, Game.ticker);
    this._symbolLayer.alpha = 1;

    await Promise.all([this._symbol.show(), giftBoxHidePromise]);

    this.state = eSymbolContainerStates.REVEALED;
  }

  public setSymbol(symbolType: string) {
    // First check whether there is a symbol already set and remove it
    if (this._symbol) {
      this._symbolLayer.removeChild(this._symbol as Container);
      SymbolFactory.return(this._symbol);
    }

    // Set the new symbol by its type
    this._symbol = SymbolFactory.get(symbolType);
    this._symbolLayer.addChild(this._symbol);
  }

  public async show() {
    this.state = eSymbolContainerStates.SHOWING_GIFT_BOX;
    await this._giftBox.show();
    this.state = eSymbolContainerStates.SHOWN_GIFT_BOX;
  }

  public async hide() {
    this.state = eSymbolContainerStates.REMOVING;
    // TODO: Hide the symbol
    this._symbol.hide();
    this.state = eSymbolContainerStates.REMOVED;
  }
}
