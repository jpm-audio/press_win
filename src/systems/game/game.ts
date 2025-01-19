import { Application, Container, EventEmitter } from 'pixi.js';
import Environment from '../environment/environment';
import LoadingScene from '../../scenes/loading/loadingScene';
import { eEnvironmentEvents } from '../environment/types';
import Scene from '../../scenes/scene/scene';
import { GAME_CONFIG } from './config';
import LoadManager from '../loader/loadManager';
import GameScene from '../../scenes/game/gameScene';
import {
  eGameActionEvents,
  eGameEvents,
  eGameStates,
  iGameEventErrorInfo,
  iGameEventStateChangeInfo,
} from './types';
import GameServer from '../../api/gameServer';
import { eGameClientErrors } from './errors';
import { iServerInitResponse, iServerPlayResponse } from '../../api/types';

/**
 * Game controller.
 *
 * It is the main class of the game, and it is responsible for the whole game flow.
 * It is a singleton, so it can be accessed from anywhere in the application.
 */
export default class Game {
  private static _instance: Game;
  private static _bus: EventEmitter;
  private static _environment: Environment;
  private static _app: Application;
  private static _gameServer: GameServer;
  private _currentScene!: Scene;
  private _assetsResolution!: number;
  private _assetsResolutionIndex!: number;
  private _layerGame!: Container;
  private _loader!: LoadManager;
  private _state: eGameStates = eGameStates.WAITING;
  private _lastPlayResponse: iServerPlayResponse | null = null;

  public static get game() {
    return Game._instance;
  }

  public static get bus() {
    return Game._bus;
  }

  public static get environment() {
    return Game._environment;
  }

  public static get stage() {
    return Game._app.stage;
  }

  public static get renderer() {
    return Game._app.renderer;
  }

  public static get ticker() {
    return Game._app.ticker;
  }

  /**
   * Singleton init method.
   *
   * It creates and initializes all global systems, resources and services.
   * It also creates the singleton instance of the game: Game.game
   *
   * PLEASE CALL THIS METHOD ONLY ONCE PER APPLICATION LIFE.
   *
   * @param app
   * @param environment
   * @returns
   */
  public static async init(app: Application, environment: Environment) {
    if (Game._instance === undefined) {
      Game._instance = new Game();
      Game._bus = new EventEmitter();
      Game._environment = environment;
      Game._app = app;
      Game._gameServer = new GameServer();
    }

    return Game.game.init();
  }

  /**
   * Getters and Setters
   */

  public get state() {
    return this._state;
  }

  public set state(value: eGameStates) {
    if (this._state !== value) {
      // Update State
      const prevState = this._state;
      this._state = value;

      // Broadcast the event
      const eventInfo: iGameEventStateChangeInfo = {
        event: eGameEvents.STATE_CHANGE,
        prevState: prevState,
        state: this._state,
      };
      Game.bus.emit(eGameEvents.STATE_CHANGE, eventInfo);
    }
  }

  public get assetsResolution() {
    return this._assetsResolution;
  }

  public get assetsResolutionIndex() {
    return this._assetsResolutionIndex;
  }

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Initializes the game.
   * a - First init Error notification system
   * b - Second try to create a server connexion and retrieve "init" response
   * c - Loads the assets
   * f - Changes the current scene to the game scene.
   *
   * @returns
   */
  public async init() {
    // First init Error notification system
    Game._bus.on(eGameEvents.ERROR, this.onError, this);
    Game._bus.on(eGameActionEvents.PLAY_ACTION, this.onPlayAction, this);
    Game._bus.on(
      eGameActionEvents.SYMBOLS_REVEALED,
      this.onSymbolsRevealAction,
      this
    );

    // Second try to create a server connexion and retrieve init response for the game
    const initResponse = await Game._gameServer.init();
    if (initResponse === null) {
      Game.bus.emit(eGameEvents.ERROR, {
        error: eGameClientErrors.SERVER_INIT_FAILS,
      });
      return;
    }

    // TODO - Update current player State

    // Save last play response
    this._lastPlayResponse = initResponse.initPlay;

    // Game Resolution
    this._assetsResolutionIndex = GAME_CONFIG.getAssetsResolutionIndex(
      Game.environment.referenceMaxCanvasSize
    );
    this._assetsResolution =
      GAME_CONFIG.scaleResolutions[this._assetsResolutionIndex];

    // Layers
    this._layerGame = new Container();
    Game.stage.addChild(this._layerGame);

    // Resize Handling
    this._watchResize();

    // Create LoadManager
    const fileSufix =
      GAME_CONFIG.fileResolutionSufixes[this._assetsResolutionIndex];
    this._loader = new LoadManager().init(
      GAME_CONFIG.getAssetsInitOptions(fileSufix)
    );

    // Preloading...
    await this._loader.loadByBundleIndex(0);

    this.load(initResponse);
  }

  /**
   * Takes care of the loading process.
   * a - It changes the current scene to the loading scene, and then loads the assets.
   * b - After the assets are loaded, it changes the current scene to the game scene.
   * c - Finally, it updates the game state to READY.
   *
   * @param initResponse
   */
  public async load(initResponse: iServerInitResponse) {
    // <-> Change Preloading Scene to Loading Scene
    const loadingScene = new LoadingScene();
    loadingScene.init();
    await this._setScene(loadingScene);

    // Update State
    this.state = eGameStates.LOADING;

    // Loading...
    await this._loader.loadByBundleIndex(1, (progress) =>
      loadingScene.progressTo(progress)
    );

    // <-> Change Loading Scene to Game Scene
    const gameScene = new GameScene().init(initResponse);
    await loadingScene.waitForStartAction();
    await this._setScene(gameScene);

    // Set initial play
    await gameScene.setPlay(initResponse.initPlay);

    // Update State
    this.state = eGameStates.READY;
  }

  /**
   * Handly function to just activates the screen resize event listeners.
   * It is called in the init method, and just once per instance life.
   */
  protected _watchResize() {
    Game.environment.on(
      eEnvironmentEvents.SCREEN_SIZE_CHANGE,
      this.onScreenResize,
      this
    );
    Game.environment.on(
      eEnvironmentEvents.ORIENTATION_CHANGE,
      this.onScreenResize,
      this
    );
    this.onScreenResize();
  }

  /**
   * Method to handle the a scene change to a new scene provided.
   * It removes the previous scene from the game layer and adds the new one.
   * @param scene
   */
  protected async _setScene(scene: Scene) {
    const prevScene = this._currentScene;

    this._currentScene = scene;
    this._layerGame.addChildAt(this._currentScene, 0);
    this._currentScene.open();

    await prevScene?.close();
    this._layerGame.removeChild(prevScene);
  }

  /**
   * Listener callback called when all symbols has been revealed,
   * but only if the game is in the READY state.
   *
   * @returns
   */
  public async onSymbolsRevealAction() {
    if (this.state !== eGameStates.READY || this._lastPlayResponse === null)
      return;

    // SHOW RESULTS (if any)
    if (this._lastPlayResponse.play.win) {
      const scene = this._currentScene as GameScene;
      await scene.showResults(this._lastPlayResponse);
    }

    // Update State
    this.state = eGameStates.REVEALED;
  }

  /**
   * Listener callback called when the PLAY_ACTION event is emitted,
   * but only if the game is in the REVEALED state.
   *
   * It provides all the handling for the play action until game is "READY" state again.
   *
   * @returns
   */
  public async onPlayAction() {
    if (this.state !== eGameStates.REVEALED) return;

    const scene = this._currentScene as GameScene;

    if (scene !== null && scene.startPlay !== undefined) {
      // PLAY ACTION
      this.state = eGameStates.PLAYING;
      const startPlayPromise = scene.startPlay();

      // Wait for the server response
      this._lastPlayResponse = await Game._gameServer.play();

      // Wait for the scene
      await startPlayPromise;

      // Stop Play
      await scene.setPlay(this._lastPlayResponse);

      // Update State
      this.state = eGameStates.READY;
    }
  }

  /**
   * Listener callback called when the ERROR event is emitted.
   * It is meant for general error notification uses for the player,
   * so it shows a message to the player.
   *
   * @param event
   */
  public onError(event: iGameEventErrorInfo) {
    // TODO: Show error message with a more friendly way than the old friend alert :s
    alert(event.error);
  }

  /**
   * Listener callback called when the SCREEN_SIZE_CHANGE, ORIENTATION_CHANGE events are emitted.
   * It is meant to handle the game scaling to fit the current screen size.
   * Propagates event to the current scene providing the new draw size,
   *
   * drawSize: Size canvas adapted to the screen aspect ratio (AR), "space to draw the game".
   */
  public onScreenResize() {
    // Calculate the proper scale to fit the current size.
    let scale = 1;
    const referenceAR =
      GAME_CONFIG.referenceSize.width / GAME_CONFIG.referenceSize.height;
    const hasCalculationToWidth = Game.environment.viewportAR < referenceAR;

    if (hasCalculationToWidth) {
      scale = Game._app.canvas.width / GAME_CONFIG.referenceSize.width;
    } else {
      scale = Game._app.canvas.height / GAME_CONFIG.referenceSize.height;
    }

    scale /= Game.environment.canvasResolution;

    const drawSize = hasCalculationToWidth
      ? {
          width: GAME_CONFIG.referenceSize.width,
          height: GAME_CONFIG.referenceSize.width / Game.environment.viewportAR,
        }
      : {
          width: GAME_CONFIG.referenceSize.height * Game.environment.viewportAR,
          height: GAME_CONFIG.referenceSize.height,
        };

    this._layerGame.scale.set(scale);

    // Center the game layer by the reference frame into the draw frame
    this._layerGame.x =
      ((drawSize.width - GAME_CONFIG.referenceSize.width) / 2) * scale;
    this._layerGame.y =
      ((drawSize.height - GAME_CONFIG.referenceSize.height) / 2) * scale;

    if (this._currentScene) {
      this._currentScene.onScreenResize(drawSize);
    }
  }

  /**
   * Function called when the game is destroyed.
   * It removes the SCREEN_SIZE_CHANGE, ORIENTATION_CHANGE events listeners.
   * It probably has no sense in a game, but in case different game instances are managed,
   * you better call this when a game instance is disposed so events are removed.
   */
  public destroy() {
    Game.environment.off(
      eEnvironmentEvents.SCREEN_SIZE_CHANGE,
      this.onScreenResize,
      this
    );
    Game.environment.off(
      eEnvironmentEvents.ORIENTATION_CHANGE,
      this.onScreenResize,
      this
    );
    Game._bus.off(eGameEvents.ERROR, this.onError, this);
    Game._bus.off(eGameActionEvents.PLAY_ACTION, this.onPlayAction, this);
    Game._bus.off(
      eGameActionEvents.SYMBOLS_REVEALED,
      this.onSymbolsRevealAction,
      this
    );
  }
}
