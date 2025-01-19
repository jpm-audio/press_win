import { PointData } from 'pixi.js';
import { ParticleEmitter } from '../../../systems/particles/ParticleEmitter';
import { iParticleEmitterOptions } from '../../../systems/particles/types';
import FadeContainer from '../../fadeContainer/fadeContainer';

export class CoinsAnimation extends FadeContainer {
  protected _emitter: ParticleEmitter;

  public get ticker() {
    return this._emitter.ticker;
  }

  public get isPlaying() {
    return this._emitter.isRunning;
  }

  public get emitter() {
    return this._emitter;
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
    this.alpha = 1;
    this.visible = true;
    this._emitter.start(true);
  }

  public async stop() {
    this._emitter.spawn = false;
    await this.hide();
    this._emitter.stop();
  }
}
