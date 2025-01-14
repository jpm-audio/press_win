import { Application, Assets, Container, EventEmitter } from 'pixi.js';
import Environment from '../environment/environment';
import LoadingScene from '../../scenes/loading/loadingScene';
import { eEnvironmentEvents } from '../environment/types';
import Scene from '../../scenes/scene/scene';
import { GAME_CONFIG } from './config';

export default class Game {
  private static _instance: Game;
  private static _bus: EventEmitter;
  private static _environment: Environment;
  private static _app: Application;
  private _currentScene!: Scene;
  private _assetsResolution!: number;
  private _assetsResolutionIndex!: number;
  private _layerGame!: Container;

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

  public static async init(app: Application, environment: Environment) {
    Game._instance = new Game();
    Game._bus = new EventEmitter();
    Game._environment = environment;
    Game._app = app;
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
    this.watchResize();

    // Preloading
    await this.preload();

    const loadingScene = new LoadingScene();
    loadingScene.init();
    await this._setScene(loadingScene);

    // Loading

    // Build Game

    // Start Game

    return;
  }

  public watchResize() {
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

  public async preload() {
    const fileSufix =
      GAME_CONFIG.fileResolutionSufixes[this._assetsResolutionIndex];
    const assetsInitOptions = GAME_CONFIG.getAssetsInitOptions(fileSufix);
    Assets.init(assetsInitOptions);

    await Assets.loadBundle(assetsInitOptions?.manifest?.bundles[0].name);
  }

  protected async _setScene(scene: Scene) {
    const prevScene = this._currentScene;

    this._currentScene = scene;
    this._currentScene.alpha = 1;
    this._layerGame.addChild(this._currentScene);

    await prevScene?.close();
    this._layerGame.removeChild(prevScene);
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

    if (this._currentScene) {
      this._currentScene.onScreenResize(drawSize);
    }
  }
}
