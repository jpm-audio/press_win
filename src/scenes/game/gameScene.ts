import { Color, DestroyOptions, Sprite, Texture } from 'pixi.js';
import Scene from '../scene/scene';
import { eGameSceneModes } from './types';
import gsap from 'gsap';
import SymbolsFrame from '../../components/symbols/frame/symbolsFrame';
import {
  GAME_CONFIG,
  VALUE_PARSER,
  WIN_COUNTER_OPTIONS,
} from '../../systems/game/config';
import { iServerInitResponse, iServerPlayResponse } from '../../api/types';
import MessageBox from '../../components/messageBox/messageBox';
import {
  GAME_MESSAGES,
  MESSAGE_BOX_CONFIG,
  WIN_ANIMATION_CONFIG,
} from './config';
import Game from '../../systems/game/game';
import { eSymbolsFrameEvents } from '../../components/symbols/frame/types';
import ButtonFactory from '../../components/buttons/buttonFactory';
import Button from '../../components/buttons/button';
import DefaultButtonBuilder from '../../components/buttons/defaultButton/defaultButtonBulder';
import { PLAY_BUTTON_CONFIG } from '../../components/buttons/defaultButton/config';
import {
  eGameActionEvents,
  eGameEvents,
  eGameStates,
  iGameEventErrorInfo,
  iGameEventStateChangeInfo,
} from '../../systems/game/types';
import WinSymbol from '../../components/winSymbol/winSymbol';
import { CoinsAnimation } from '../../components/particles/coins/coinsAnimation';
import { COINS_RAIN_PARTICLES_CONFIG } from '../../components/particles/coins/configs/rainConfig';
import waitForTickerTime from '../../utils/waitForTickerTime';
import WinCounter from '../../components/display/winCounter/winCounter';
import GameTitle from '../../components/gameTitle/gameTitle';

export default class GameScene extends Scene {
  protected _backgrounds: Map<eGameSceneModes, Sprite> = new Map();
  protected _symbolsFrame!: SymbolsFrame;
  protected _coinsRain!: CoinsAnimation;
  protected _winSymbol!: WinSymbol;
  protected _messageBox!: MessageBox;
  protected _winCounter!: WinCounter;
  protected _playButton!: Button;
  protected _gameTitle!: GameTitle;
  protected _bigWinTitle!: GameTitle;
  protected _mode: eGameSceneModes;

  constructor() {
    super();
    this._mode = eGameSceneModes.GAME;
  }

  protected _listenEvents() {
    Game.bus.on(eGameEvents.STATE_CHANGE, this.onGameStateChange, this);
    Game.bus.on(eGameEvents.ERROR, this.onGameError, this);
    this._symbolsFrame.on(
      eSymbolsFrameEvents.ALL_SYMBOLS_REVEALED,
      this.onFrameSymbolsRevealed,
      this
    );
  }

  protected _unlistenEvents() {
    Game.bus.off(eGameEvents.STATE_CHANGE, this.onGameStateChange, this);
    Game.bus.off(eGameEvents.ERROR, this.onGameError, this);
    this._symbolsFrame.off(
      eSymbolsFrameEvents.ALL_SYMBOLS_REVEALED,
      this.onFrameSymbolsRevealed,
      this
    );
  }

  /**
   * Initializes the game scene.
   * It creates the background, the symbols frame, the message box and the play button.
   *
   * @param initResponse
   * @returns
   */
  public init(initResponse: iServerInitResponse) {
    this._id = 'Game Scene';
    // Background
    const background = this._getBackground([
      { color: new Color(0x00fefe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(background);
    this._backgrounds.set(eGameSceneModes.GAME, background);

    // Win Background
    const winBackground = this._getBackground([
      { color: new Color(0xfe00fe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(winBackground);
    this._backgrounds.set(eGameSceneModes.WIN, winBackground);
    winBackground.alpha = 0;

    // Win Background
    const bigWinBackground = this._getBackground([
      { color: new Color(0xffbf00), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(bigWinBackground);
    this._backgrounds.set(eGameSceneModes.BIG_WIN, bigWinBackground);
    bigWinBackground.alpha = 0;

    // Coin Rain
    this._coinsRain = new CoinsAnimation(COINS_RAIN_PARTICLES_CONFIG);
    this._coinsRain.x = GAME_CONFIG.referenceSize.width / 2;
    this._coinsRain.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._coinsRain);

    // Game Titles
    this._gameTitle = new GameTitle(Texture.from('game_logo.png'));
    this._gameTitle.x = GAME_CONFIG.referenceSize.width / 2;
    this._gameTitle.y = this._gameTitle.height / 2;
    this.addChild(this._gameTitle);

    this._bigWinTitle = new GameTitle(Texture.from('bigwin_title.png'));
    this._bigWinTitle.scale.set(0.85);
    this._bigWinTitle.x = this._gameTitle.x;
    this._bigWinTitle.y = this._bigWinTitle.height / 2 + 15;
    this._bigWinTitle.visible = false;
    this._bigWinTitle.alpha = 0;
    this.addChild(this._bigWinTitle);

    // Symbols Frame
    this._symbolsFrame = new SymbolsFrame().init({
      numSymbols: initResponse.initPlay.play.symbols.length,
      symbolTypes: initResponse.definition.symbols,
      initialState: initResponse.initPlay.play.symbols,
    });
    this._symbolsFrame.x = GAME_CONFIG.referenceSize.width / 2;
    this._symbolsFrame.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._symbolsFrame);

    // Win Symbol
    this._winSymbol = new WinSymbol();
    this._winSymbol.x = GAME_CONFIG.referenceSize.width / 2;
    this._winSymbol.y = GAME_CONFIG.referenceSize.height / 2;
    this._winSymbol.visible = false;
    this.addChild(this._winSymbol);

    // Message Box
    this._messageBox = new MessageBox({
      ...MESSAGE_BOX_CONFIG,
      ...{ resolution: Game.game.assetsResolution },
    });
    this._messageBox.x = GAME_CONFIG.referenceSize.width / 2;
    this._messageBox.y = (3 * GAME_CONFIG.referenceSize.height) / 4;
    this._messageBox.alpha = 0;
    this.addChild(this._messageBox);

    // Play Button
    this._playButton = ButtonFactory.button({
      buttonBuilder: new DefaultButtonBuilder(PLAY_BUTTON_CONFIG),
      text: 'playButton',
      width: 200,
      height: 50,
    });
    this._playButton.x = GAME_CONFIG.referenceSize.width / 2;
    this._playButton.y = this._messageBox.y + 75;
    this._playButton.disable();
    this._playButton.visible = false;
    this._playButton.on('pointerup', () =>
      Game.bus.emit(eGameActionEvents.PLAY_ACTION)
    );
    this.addChild(this._playButton);

    // Start listening events
    this._listenEvents();

    this._winCounter = new WinCounter({
      ...WIN_COUNTER_OPTIONS,
      ...{ ticker: Game.ticker },
    });
    this._winCounter.alpha = 0;
    this._winCounter.visible = false;
    this._winCounter.x = GAME_CONFIG.referenceSize.width / 2;
    this._winCounter.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._winCounter);

    return this;
  }

  /**
   * It handles the visual mode change of the game scene, for normal game mode
   * and win mode, that is win celebration animations.
   *
   * @param mode
   * @param duration
   */
  public async modeTo(mode: eGameSceneModes, duration: number = 0.5) {
    if (this._mode !== mode) {
      // Change Background
      let currentBackground = this._backgrounds.get(
        eGameSceneModes.GAME
      ) as Sprite;
      const nextBackground = this._backgrounds.get(mode) as Sprite;

      this._backgrounds.forEach((background) => {
        if (background.alpha === 1) currentBackground = background;
      });

      this._mode = mode;

      if (mode === eGameSceneModes.BIG_WIN) {
        this._bigWinTitle.show();
        this._bigWinTitle.playWin();
        this._gameTitle.hide();
      }

      if (mode === eGameSceneModes.GAME) {
        this._bigWinTitle.playNormal();
        this._bigWinTitle.hide();
        this._gameTitle.show();
        this._gameTitle.playNormal();
      }

      if (mode === eGameSceneModes.WIN) {
        this._gameTitle.playWin();
      }

      await gsap.to(currentBackground, {
        duration: duration,
        ease: 'power1.inOut',
        alpha: 0,
        onUpdate: () => {
          nextBackground.alpha = 1 - currentBackground.alpha;
        },
      });
    }
  }

  /**
   * Listener callback called when the GAME_ERROR event is emitted.
   * It is meant to handle actions when the game state changes.
   *
   * @param event
   */
  public onGameError(_event: iGameEventErrorInfo) {
    // TODO - Actions on error
  }

  /**
   * Listener callback called when the ALL_SYMBOLS_REVEALED event is emitted
   * from the symbols frame.
   * Then it emits the SYMBOLS_REVEALED game action event to notify the game controller
   * as a player action of reaveling all symbols.
   */
  public onFrameSymbolsRevealed() {
    Game.bus.emit(eGameActionEvents.SYMBOLS_REVEALED);
  }

  /**
   * Listener callback called when the GAME_STATE_CHANGE event is emitted.
   * It is meant to handle actions when the game state changes.
   *
   * @param state
   */
  public onGameStateChange(event: iGameEventStateChangeInfo) {
    if (event.state === eGameStates.READY) {
      this.onReadyGameState();
      return;
    }

    if (event.state === eGameStates.REVEALED) {
      this.onRevealedGameState();
      return;
    }
  }

  /**
   * Starts the game scene.
   * It shows the message box and starts the symbols frame animations.
   */
  public async onReadyGameState() {
    this._messageBox.setText(GAME_MESSAGES.initialState());
  }

  /**
   * Listener callback called when the REVEALED game state is Reached
   */
  public async onRevealedGameState() {
    this._playButton.enable();
    this._playButton.visible = true;
  }

  /**
   * To call from Game Controller when a new play request starts,
   * it will hide the play button, and Set the symbols frame properly in "playing" state.
   */
  public async startPlay() {
    // Hide play button
    this._playButton.disable();
    this._playButton.visible = false;

    // Set the message box properly
    const messagePromise = this._messageBox.setText(GAME_MESSAGES.playState());

    // Start Play State on the screen
    const symbolsPromise = this._symbolsFrame.startPlay();

    await Promise.all([messagePromise, symbolsPromise]);
  }

  /**
   * To call from Game Controller when a new play request is finished,
   * it will prepare the scene for a ready state for play start revealing symbols.
   *
   * @param playResponse
   */
  public async setPlay(playResponse: iServerPlayResponse) {
    // Clear the screen and show the new boxes
    await this._symbolsFrame.initSymbols(playResponse);
  }

  /**
   * To call from Game Controller when all symbols are revealed,
   * and game is ready for showing the results and celebrate the win!
   *
   * @param playResponse
   */
  public async showResults(playResponse: iServerPlayResponse) {
    // Hide the message box
    this._messageBox.hide();

    // Check whether there is a win
    if (playResponse.play.win) {
      const winInfo = playResponse.play.win;
      const winAnimationConfig = WIN_ANIMATION_CONFIG(winInfo.totalWin);
      const winSymbols = winInfo.winSymbols;

      this.modeTo(winAnimationConfig.gameMode);

      this._winSymbol.visible = true;

      // Arrange symbols for winning animation
      await this._symbolsFrame.showWin(winSymbols);

      // Big Win Coins Rain
      if (winAnimationConfig.isBigWin) this._coinsRain.start();

      // Show and Start the Win Counter Display
      this._winCounter.countTo(
        winInfo.totalWin,
        0,
        winAnimationConfig.winCountTime,
        64
      );

      // Show the win symbol animation
      await this._winSymbol.play(
        winInfo.winSymbol as string,
        winAnimationConfig.winCountTime / 1000
      );

      this._winCounter.hide();
      this._messageBox.setTextWidthValue(GAME_MESSAGES.winState(), {
        prizeAmount: VALUE_PARSER(winInfo.totalWin),
      });
      const modePromise = this.modeTo(eGameSceneModes.GAME);

      this._winSymbol.visible = false;
      if (winAnimationConfig.isBigWin) {
        this._coinsRain.emitter.spawn = false;
        await waitForTickerTime(1000, Game.ticker);
        this._coinsRain.stop();
      }

      await modePromise;
    }
  }

  /**
   * Function override to remove the events listeners when the scene is destroyed.
   *
   * @param options
   */
  public destroy(options?: DestroyOptions): void {
    this._unlistenEvents();
    super.destroy(options);
  }
}
