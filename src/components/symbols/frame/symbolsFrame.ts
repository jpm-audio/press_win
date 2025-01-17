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
import { iServerPlayResponse } from '../../../api/types';
import { BubblesAnimation } from '../../particles/bubbles/bubblesAnimation';
import gsap from 'gsap';

export default class SymbolsFrame extends Container {
  protected _symbolsContainer: SymbolContainer[] = [];
  protected _bubblesParticles: BubblesAnimation[] = [];
  protected _symbolsLayer: Container;
  protected _bubblesLayer: Container;
  protected _config = SYMBOLS_FRAME_CONFIG;

  constructor() {
    super();

    this._symbolsLayer = new Container();
    this.addChild(this._symbolsLayer);

    this._bubblesLayer = new Container();
    this.addChild(this._bubblesLayer);
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

      const bubblesParticles = new BubblesAnimation();
      bubblesParticles.x = symbolContainer.x;
      this._bubblesParticles.push(bubblesParticles);
      this._bubblesLayer.addChild(bubblesParticles);
    }

    this._symbolsLayer.x = this._bubblesLayer.x =
      -GAME_CONFIG.referenceSize.width / 2;

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
    let lastPromise;
    for (let i = 0; i < this._symbolsContainer.length; i++) {
      if (i !== 0) await waitForTickerTime(150, Game.ticker);
      lastPromise = this.transformSymbolsIntoBubbles(i);
    }
    await lastPromise;
  }

  public async transformSymbolsIntoBubbles(index: number) {
    this._symbolsContainer[index].hide();
    await waitForTickerTime(400, Game.ticker);
    this._bubblesParticles[index].start();
  }

  public async removeBubblesParticles(index: number) {
    const bubbles = this._bubblesParticles[index];
    bubbles.setWind({ x: 1000, y: 0 });
    await waitForTickerTime(1000, Game.ticker);
    await gsap.to(bubbles, {
      duration: 0.5,
      pixi: {
        alpha: 0,
      },
    });
    bubbles.stop();
    bubbles.setWind({ x: 0, y: 0 });
    bubbles.alpha = 1;
  }

  public async stopPlay(playResponse: iServerPlayResponse) {
    let lastPromise;
    for (let i = 0; i < this._bubblesParticles.length; i++) {
      lastPromise = this.removeBubblesParticles(i);
    }

    await lastPromise;

    playResponse.play.symbols.forEach((symbolId, index) => {
      this._symbolsContainer[index].setSymbol(symbolId);
    });

    await this.start();
  }
}
