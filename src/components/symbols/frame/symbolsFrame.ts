import { Container } from 'pixi.js';
import { GAME_CONFIG } from '../../../systems/game/config';
import SymbolContainer from '../symbolContainer/symbolContainer';
import { eSymbolsFrameEvents, iSymbolsFrameOptions } from './types';
import SymbolFactory from '../symbol/symbolFactory';
import waitForTickerTime from '../../../utils/waitForTickerTime';
import Game from '../../../systems/game/game';
import { SYMBOLS_FRAME_CONFIG } from './config';
import {
  eSymbolContainerEvents,
  eSymbolContainerStates,
} from '../symbolContainer/types';

export default class SymbolsFrame extends Container {
  protected _symbolsContainer: SymbolContainer[] = [];
  protected _symbolsLayer: Container;
  protected _config = SYMBOLS_FRAME_CONFIG;

  constructor() {
    super();

    this._symbolsLayer = new Container();
    this.addChild(this._symbolsLayer);
  }

  public init(options: iSymbolsFrameOptions) {
    const numSymbols = options.numSymbols;
    const xDistance = GAME_CONFIG.referenceSize.width / (numSymbols + 1);

    // Initialize Factory to pre spawn symbols
    for (let i = 0; i < options.symbolTypes.length; i++) {
      for (let j = 0; j < numSymbols; j++) {
        SymbolFactory.spawn(options.symbolTypes[i]);
      }
    }

    // Create SymbolContainers
    for (let i = 0; i < numSymbols; i++) {
      const symbolContainer = new SymbolContainer();
      symbolContainer.x = xDistance * (i + 1);
      symbolContainer.setSymbol(options.initialState[i]);
      this._symbolsContainer.push(symbolContainer);
      this._symbolsLayer.addChild(symbolContainer);
      symbolContainer.on(
        eSymbolContainerEvents.STATE_CHANGED,
        this.onSymbolStateChanged,
        this
      );
    }

    this._symbolsLayer.x = -GAME_CONFIG.referenceSize.width / 2;

    return this;
  }

  public onSymbolStateChanged(state: eSymbolContainerStates) {
    if (state === eSymbolContainerStates.REVEALED) {
      let revealed = 0;
      this._symbolsContainer.forEach((symbolContainer) => {
        if (symbolContainer.state === eSymbolContainerStates.REVEALED)
          revealed++;
      });

      if (revealed === this._symbolsContainer.length) {
        this.emit(eSymbolsFrameEvents.ALL_SYMBOLS_REVEALED);
      }
    }
  }

  public async start() {
    let lastPromise;
    for (let i = 0; i < this._symbolsContainer.length; i++) {
      lastPromise = this._symbolsContainer[i].show();
      await waitForTickerTime(SYMBOLS_FRAME_CONFIG.showInterval, Game.ticker);
    }
    await lastPromise;
  }

  public async startPlay() {
    this._symbolsContainer.forEach((symbolContainer) => {
      symbolContainer.hide();
    });
  }

  public async stopPlay() {}
}
