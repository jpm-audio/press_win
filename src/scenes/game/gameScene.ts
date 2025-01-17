import { Color, Sprite, TextStyleOptions } from 'pixi.js';
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
import { eGameEvents } from '../../systems/game/types';

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
      numSymbols: initResponse.play.symbols.length,
      symbolTypes: initResponse.definition.symbols,
      initialState: initResponse.play.symbols,
    });
    this._symbolsFrame.x = GAME_CONFIG.referenceSize.width / 2;
    this._symbolsFrame.y = GAME_CONFIG.referenceSize.height / 2;
    this._symbolsFrame.on(
      eSymbolsFrameEvents.ALL_SYMBOLS_REVEALED,
      this.onAllSymbolsRevealed,
      this
    );
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
      Game.bus.emit(eGameEvents.PLAY_ACTION)
    );
    this.addChild(this._playButton);

    return this;
  }

  public async start() {
    this._messageBox.setText(MESSAGE_BOX_CONFIG.messages.initialState());
    this._messageBox.show();
    await this._symbolsFrame.start();
  }

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

  public onAllSymbolsRevealed() {
    this._messageBox.setText(MESSAGE_BOX_CONFIG.messages.winState());
    this._playButton.enable();
    this._playButton.visible = true;
  }

  public startPlay() {
    // Hide play button
    this._playButton.disable();
    this._playButton.visible = false;

    // Start Play State on the screen
    this._messageBox.setText(MESSAGE_BOX_CONFIG.messages.playState());
    this._symbolsFrame.startPlay();
  }

  public stopPlay(playResponse: iServerPlayResponse) {
    // Hide the message box
    this._messageBox.hide();

    // Clear the screen and show the new boxes
    this._symbolsFrame.stopPlay(playResponse);
  }
}
