import { Container } from 'pixi.js';
import { ParticleEmitter } from '../../../systems/particles/ParticleEmitter';
import { SMOKE_PARTICLES_CONFIG } from './configs/smokeConfig';

export class SmokeAnimation extends Container {
  protected _emitter: ParticleEmitter;

  public get ticker() {
    return this._emitter.ticker;
  }

  constructor() {
    super();

    this._emitter = new ParticleEmitter(SMOKE_PARTICLES_CONFIG);

    this.addChild(this._emitter);
  }

  public start() {
    this._emitter.start(true);
  }

  public stop() {
    this._emitter.stop();
  }
}
