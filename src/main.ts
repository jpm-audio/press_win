import './global.css';
import { Application, Container, Sprite } from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import Environment from './systems/environment/environment';
import { ENVIRONMENT_CONFIG } from './systems/environment/settings';
import Game from './systems/game/game';

(async () => {
  const environment = new Environment(ENVIRONMENT_CONFIG);
  const app = new Application();
  const canvasContainerEl: HTMLElement | null =
    document.querySelector('#canvas_container');

  if (canvasContainerEl === null) {
    throw new Error('Canvas container not found');
  }

  // Init PIXI
  await app.init({
    backgroundAlpha: 0,
    resizeTo: canvasContainerEl,
    resolution: environment.canvasResolution,
    roundPixels: true,
  });
  canvasContainerEl.appendChild(app.canvas);

  // Init GSAP
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI({ Container, Sprite });

  // Init Game
  await Game.init(app, environment);

  // Remove Splash Screen
  const elSplashScreen = document.getElementById('splash_screen');
  await gsap.to(elSplashScreen, {
    duration: 0.5,
    opacity: 0,
    ease: 'power1.inOut',
  });
  elSplashScreen?.parentNode?.removeChild(elSplashScreen);

  //window.Game = Game;
})();
