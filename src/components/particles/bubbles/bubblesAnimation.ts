import { Container, PointData } from 'pixi.js';
import { ParticleEmitter } from '../../../systems/particles/ParticleEmitter';
import { BUBBLES_PARTICLES_CONFIG } from './configs/bubblesConfig';

export class BubblesAnimation extends Container {
  protected _emitter: ParticleEmitter;

  public get ticker() {
    return this._emitter.ticker;
  }

  public get isPlaying() {
    return this._emitter.isRunning;
  }

  constructor() {
    super();

    this._emitter = new ParticleEmitter(BUBBLES_PARTICLES_CONFIG);

    this.addChild(this._emitter);
  }

  public setWind(value: PointData) {
    this._emitter.wind = value;
  }

  public start() {
    this._emitter.start(true);
  }

  public stop() {
    this._emitter.stop();
  }
}
