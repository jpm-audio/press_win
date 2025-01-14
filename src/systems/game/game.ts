import { Application, EventEmitter, Graphics } from 'pixi.js';
import Environment from '../environment/environment';

export default class Game {
  private static _instance: Game;
  private static _bus: EventEmitter;
  private static _environment: Environment;
  private static _app: Application;

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

  /**
   * Constructor
   */
  constructor() {}

  public async init() {
    const graphics = new Graphics();
    graphics.rect(0, 0, 100, 100);
    graphics.fill({
      color: 0x00ff00,
      alpha: 0.5,
    });
    Game.stage.addChild(graphics);

    // Load Assets
    // Build Game
    // Start Game

    return;
  }
}
