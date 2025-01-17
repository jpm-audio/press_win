import { Application, Container, EventEmitter } from 'pixi.js';
import Environment from '../environment/environment';
import LoadingScene from '../../scenes/loading/loadingScene';
import { eEnvironmentEvents } from '../environment/types';
import Scene from '../../scenes/scene/scene';
import { GAME_CONFIG } from './config';
import LoadManager from '../loader/loadManager';
import GameScene from '../../scenes/game/gameScene';
import { eGameEvents, iGameEventErrorInfo } from './types';
import GameServer from '../../api/gameServer';
import { eGameClientErrors } from './errors';
import { iServerInitResponse } from '../../api/types';

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

  public static async init(app: Application, environment: Environment) {
    Game._instance = new Game();
    Game._bus = new EventEmitter();
    Game._environment = environment;
    Game._app = app;
    Game._gameServer = new GameServer();

    return Game.game.init();
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

  public async init() {
    // First init Error notification system
    Game._bus.on(eGameEvents.ERROR, this.onError, this);

    // Second try to create a server connexion and retrieve init response for the game
    const initResponse = await Game._gameServer.init();
    if (initResponse === null) {
      Game.bus.emit(eGameEvents.ERROR, {
        error: eGameClientErrors.SERVER_INIT_FAILS,
      });
      return;
    }

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

  public async load(initResponse: iServerInitResponse) {
    // <-> Change Preloading Scene to Loading Scene
    const loadingScene = new LoadingScene();
    loadingScene.init();
    await this._setScene(loadingScene);
    Game.bus.emit(eGameEvents.LOADING);

    // Loading...
    await this._loader.loadByBundleIndex(1, (progress) =>
      loadingScene.progressTo(progress)
    );

    // <-> Change Loading Scene to Game Scene
    const gameScene = new GameScene().init(initResponse);
    await loadingScene.waitForStartAction();
    await this._setScene(gameScene);

    // Start Game
    Game.bus.emit(eGameEvents.READY);

    gameScene.start();
  }

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

  protected async _setScene(scene: Scene) {
    const prevScene = this._currentScene;

    this._currentScene = scene;
    this._layerGame.addChildAt(this._currentScene, 0);
    this._currentScene.open();

    await prevScene?.close();
    this._layerGame.removeChild(prevScene);
  }

  public onError(event: iGameEventErrorInfo) {
    alert(event.error);
  }

  public onScreenResize() {
    // Calculate the proper scale to fit the current size.
    const sizeReference = Game.environment.isPortrait
      ? Game._app.canvas.width
      : Game._app.canvas.height;
    const scale =
      sizeReference /
      GAME_CONFIG.referenceSize.height /
      Game.environment.canvasResolution;

    const drawSize = Game.environment.isPortrait
      ? {
          width: GAME_CONFIG.referenceSize.height,
          height:
            GAME_CONFIG.referenceSize.height / Game.environment.viewportAR,
        }
      : {
          width: GAME_CONFIG.referenceSize.height * Game.environment.viewportAR,
          height: GAME_CONFIG.referenceSize.height,
        };

    this._layerGame.scale.set(scale);
    this._layerGame.x =
      ((drawSize.width - GAME_CONFIG.referenceSize.width) / 2) * scale;
    this._layerGame.y =
      ((drawSize.height - GAME_CONFIG.referenceSize.height) / 2) * scale;

    if (this._currentScene) {
      this._currentScene.onScreenResize(drawSize);
    }
  }

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
  }
}
