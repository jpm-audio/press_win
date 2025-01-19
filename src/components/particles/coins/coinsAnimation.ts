import { Container, PointData } from 'pixi.js';
import { ParticleEmitter } from '../../../systems/particles/ParticleEmitter';
import { iParticleEmitterOptions } from '../../../systems/particles/types';

export class CoinsFountainAnimation extends Container {
  protected _emitter: ParticleEmitter;

  public get ticker() {
    return this._emitter.ticker;
  }

  public get isPlaying() {
    return this._emitter.isRunning;
  }

  constructor(options: iParticleEmitterOptions) {
    super();

    this._emitter = new ParticleEmitter(options);

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
