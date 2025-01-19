import { Container } from 'pixi.js';
import GiftBox from '../giftBox/giftBox';
import SymbolFactory from '../symbol/symbolFactory';
import { eGiftBoxEvents } from '../giftBox/types';
import waitForTickerTime from '../../../utils/waitForTickerTime';
import Game from '../../../systems/game/game';
import Symbol from '../symbol/symbol';
import { eSymbolContainerEvents, eSymbolContainerStates } from './types';
import FadeContainer from '../../fadeContainer/fadeContainer';

/**
 * Symbol Container
 *
 * A container that holds a GiftBox and a Symbol "inside" it.
 *
 * It will takes care about the animations and handling of the GiftBox, Symbol
 * and animations such particle effects and so.
 */
export default class SymbolContainer extends FadeContainer {
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

  /**
   * Constructor
   */
  constructor() {
    super();
    this._symbolLayer = new Container();
    this._symbolLayer.alpha = 0;
    this.addChild(this._symbolLayer);

    this._giftBox = new GiftBox();
    this._giftBox.on(eGiftBoxEvents.PRESS, () => this.revealSymbol());
    this.addChild(this._giftBox);
  }

  /**
   * Reveals the symbol by exploding the GiftBox and showing the Symbol behind it.
   */
  public async revealSymbol() {
    this.state = eSymbolContainerStates.REVEALING;

    const giftBoxHidePromise = this._giftBox.explode();

    await waitForTickerTime(250, Game.ticker);
    this._symbolLayer.alpha = 1;

    await Promise.all([this._symbol.show(), giftBoxHidePromise]);

    this.state = eSymbolContainerStates.REVEALED;
  }

  /**
   * Prepares the symbol for the next reveal.
   * It removes the current symbol, if any, and sets the new one.
   *
   * @param symbolType
   */
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

  /**
   * Shows the GiftBox by its animation, falling down.
   */
  public async show() {
    this.reset();
    this.state = eSymbolContainerStates.SHOWING_GIFT_BOX;
    await this._giftBox.fallDown();
    this.state = eSymbolContainerStates.SHOWN_GIFT_BOX;
  }

  /**
   * Hide the symbol by exploding it.
   */
  public async symbolExplode() {
    this.state = eSymbolContainerStates.REMOVING;
    await this._symbol.explode();
    this.state = eSymbolContainerStates.REMOVED;
  }

  /**
   * Hide the symbol container by disolving it.
   */
  public async symbolDisolve() {
    await this._symbol.disolve();
  }

  /**
   * Hide the symbol container by reducing it.
   */
  public async symbolReduce(duration?: number) {
    await this._symbol.reduce(duration);
  }
}
