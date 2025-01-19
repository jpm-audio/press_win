import { Color, DestroyOptions, Sprite, TextStyleOptions } from 'pixi.js';
import Scene from '../scene/scene';
import { eGameSceneModes } from './types';
import gsap from 'gsap';
import SymbolsFrame from '../../components/symbols/frame/symbolsFrame';
import { GAME_CONFIG } from '../../systems/game/config';
import { iServerInitResponse, iServerPlayResponse } from '../../api/types';
import MessageBox from '../../components/messageBox/messageBox';
import { MESSAGE_BOX_CONFIG } from './config';
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

export default class GameScene extends Scene {
  protected _background!: Sprite;
  protected _winBackground!: Sprite;
  protected _symbolsFrame!: SymbolsFrame;
  protected _messageBox!: MessageBox;
  protected _playButton!: Button;
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
    this._background = this._getBackground([
      { color: new Color(0x00fefe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(this._background);

    // Win Background
    this._winBackground = this._getBackground([
      { color: new Color(0xfe00fe), stop: 0 },
      { color: new Color(0x000000), stop: 1 },
    ]);
    this.addChild(this._winBackground);
    this._winBackground.alpha = 0;

    // Symbols Frame
    this._symbolsFrame = new SymbolsFrame().init({
      numSymbols: initResponse.initPlay.play.symbols.length,
      symbolTypes: initResponse.definition.symbols,
      initialState: initResponse.initPlay.play.symbols,
    });
    this._symbolsFrame.x = GAME_CONFIG.referenceSize.width / 2;
    this._symbolsFrame.y = GAME_CONFIG.referenceSize.height / 2;
    this.addChild(this._symbolsFrame);

    // Message Box
    this._messageBox = new MessageBox({
      showTime: MESSAGE_BOX_CONFIG.showTime,
      hideTime: MESSAGE_BOX_CONFIG.hideTime,
      textOptions: {
        text: '',
        style: MESSAGE_BOX_CONFIG.textStyle as TextStyleOptions,
        resolution: Game.game.assetsResolution,
      },
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
      const currentBackground =
        this._mode === eGameSceneModes.GAME
          ? this._background
          : this._winBackground;
      const nextBackground =
        mode === eGameSceneModes.GAME ? this._background : this._winBackground;

      this._mode = mode;

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
    this._messageBox.setText(MESSAGE_BOX_CONFIG.messages.initialState());
    this._messageBox.show();
  }

  /**
   * Listener callback called when the REVEALED game state is Reached
   */
  public async onRevealedGameState() {
    this._messageBox.setText(MESSAGE_BOX_CONFIG.messages.playState());
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
    const messagePromise = this._messageBox.setText(
      MESSAGE_BOX_CONFIG.messages.playState()
    );

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
    // Hide the message box
    this._messageBox.hide();

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

    // Clear the screen and show the new boxes
    await this._symbolsFrame.showResults(playResponse);
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
