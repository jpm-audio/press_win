import {
  DestroyOptions,
  ParticleContainer,
  Pool,
  Rectangle,
  Ticker,
} from 'pixi.js';
import { ParticleItem } from './ParticleItem';
import {
  iParticleEmitterOptions,
  iParticleSpawnOptions,
  iParticleUpdateOptions,
} from './types';

export class ParticleEmitter extends ParticleContainer {
  public static easing = {
    parabolic: (point: number, distance: number) => {
      return 1 - Math.pow(point / distance - 1, 2);
    },
    sinusoidal: (point: number, distance: number) => {
      return Math.sin(((point / distance - 1) * Math.PI) / 2);
    },
    exponential: (point: number, distance: number) => {
      return Math.pow(point / distance, 2);
    },
    circular: (point: number, distance: number) => {
      return 1 - Math.sqrt(1 - Math.pow(point / distance - 1, 2));
    },
  };

  protected _pool: Pool<ParticleItem>;
  protected _ticker: Ticker;
  protected _contentFrame: Rectangle | null = null;
  protected _spawnOptions: iParticleSpawnOptions;
  protected _updateOptions: iParticleUpdateOptions;
  protected _updateElapsed: number = 0;
  protected _spawnElapsed: number = 0;
  protected _spawnInterval: number = 0;
  protected _spawnVelocity: number = 0;
  protected _spawnDurationElapsed: number = 0;

  public spawnDuration: number = 0;
  public spawn: boolean = false;
  protected _environment = {
    affectSurface: false,
    gravity: 0,
    airResistance: 0,
    windX: 0,
    windY: 0,
  };

  public set contentFrame(frame: Rectangle) {
    this._contentFrame = frame;
  }

  public get contentFrame(): Rectangle | null {
    return this._contentFrame;
  }

  public get environment() {
    return this._environment;
  }

  public get ticker() {
    return this._ticker;
  }

  /**
   *
   * @param options
   */
  constructor(options: iParticleEmitterOptions) {
    super();

    if (!options.spawnOptions.lifespan && !options.contentFrame) {
      throw new Error(
        'ParticleEmitter - You must define a lifespan or a contentFrame'
      );
    }

    // Create Pool
    this._pool = new Pool(options.ClassType, options.initialSize);

    // Create Ticker
    this._ticker = new Ticker();
    this._ticker.add(this.updateEmitter, this);
    this._ticker.add(this.updateSpawnDuration, this);

    // Content Frame
    if (options.contentFrame) {
      this._contentFrame = options.contentFrame;
    }

    // Spawn and Update options
    this._spawnOptions = options.spawnOptions;
    this._updateOptions = options.updateOptions;

    // Environment
    if (options.updateOptions.environment) {
      this._environment.gravity =
        options.updateOptions.environment.gravity || 0;
      this._environment.airResistance =
        options.updateOptions.environment.airResistance || 0;
      this._environment.windX = options.updateOptions.environment.windX || 0;
      this._environment.windY = options.updateOptions.environment.windY || 0;
      this._environment.affectSurface =
        options.updateOptions.environment.affectSurface || false;
    }

    // Spawn Duration
    if (options.updateOptions.spawnDuration) {
      this.spawnDuration = options.updateOptions.spawnDuration;
    }

    this.reset();
  }

  /**
   *
   * @param range
   * @returns
   */
  public static randomFromRange(range: [number, number] | number = 0) {
    if (Array.isArray(range)) {
      return Math.random() * (range[1] - range[0]) + range[0];
    } else {
      return range;
    }
  }

  /**
   *
   * @param elapsedMS
   * @returns
   */
  protected _spawn(elapsedMS: number) {
    if (!this.spawn || !this._spawnInterval) return;

    this._spawnElapsed += elapsedMS;

    if (this._spawnElapsed < this._spawnInterval) return;

    const numSpawns = Math.floor(this._spawnElapsed / this._spawnInterval);

    for (let i = 0; i < numSpawns; i++) {
      // Spawn Particle
      this._spawnParticle();
    }

    this._spawnElapsed = 0;
    this._spawnInterval =
      1000 /
      ParticleEmitter.randomFromRange(this._updateOptions.spawnRate.value);
  }

  /**
   *
   */
  protected _spawnParticle() {
    const particle = this._pool.get({
      spawnOptions: this._spawnOptions,
      contentFrame: this._contentFrame,
    });
    this.addParticle(particle);
  }

  /**
   *
   * @param particle
   */
  protected _killParticle(particle: ParticleItem) {
    this.removeParticle(particle);
    this._pool.return(particle);
  }

  public get isPhysicsAffectedByParticleSurface() {
    return (
      this._environment.affectSurface &&
      (this._environment.windX ||
        this._environment.windY ||
        this._environment.airResistance)
    );
  }

  public static getParticleSurface(particle: ParticleItem) {
    return (
      particle.texture.height *
      particle.texture.width *
      particle.scaleY *
      particle.scaleX
    );
  }

  /**
   *
   * @param particle
   * @param elapsedMS
   */
  protected _applyEnvironment(particle: ParticleItem, elapsedMS: number) {
    const elapsedSec = elapsedMS / 1000;
    const particleSurface = this.isPhysicsAffectedByParticleSurface
      ? ParticleEmitter.getParticleSurface(particle) / 1000
      : 1;

    // Gravity
    if (this._environment.gravity) {
      particle.velocityY += this._environment.gravity * elapsedSec;
    }

    // Air resistance
    if (this._environment.airResistance) {
      if (particle.velocityX || particle.velocityY) {
        if (particle.velocityX !== 0) {
          const signVelX = Math.sign(particle.velocityX);
          const absVelX = Math.abs(particle.velocityX);
          const reductionX =
            (elapsedSec *
              particleSurface *
              this._environment.airResistance *
              absVelX) /
            particle.mass;
          particle.velocityX =
            absVelX > reductionX ? signVelX * (absVelX - reductionX) : 0;
        }

        if (particle.velocityY !== 0) {
          const signVelY = Math.sign(particle.velocityY);
          const absVelY = Math.abs(particle.velocityY);
          const reductionY =
            (elapsedSec *
              particleSurface *
              this._environment.airResistance *
              absVelY) /
            particle.mass;
          particle.velocityY =
            absVelY > reductionY ? signVelY * (absVelY - reductionY) : 0;
        }
      }
    }

    // Wind
    if (this._environment.windX) {
      particle.velocityX +=
        this._environment.windX * particleSurface * elapsedSec;
    }

    if (this._environment.windY) {
      particle.velocityY +=
        this._environment.windY * particleSurface * elapsedSec;
    }
  }

  /**
   *
   * @param particle
   * @returns
   */
  public isOutOfBounds(particle: ParticleItem) {
    if (!this._contentFrame) return false;

    return (
      !this._contentFrame.contains(particle.x, particle.y) &&
      !this._contentFrame.contains(
        particle.x + particle.texture.width,
        particle.y + particle.texture.height
      )
    );
  }

  /**
   *
   * @param ticker
   * @returns
   */
  public updateSpawnDuration(ticker: Ticker) {
    if (!this.spawn || this.spawnDuration <= 0) return;

    this._spawnDurationElapsed += ticker.elapsedMS;

    if (this._spawnDurationElapsed < this.spawnDuration) return;

    this._spawnDurationElapsed = 0;
    this.spawn = false;
  }

  /**
   *
   * @param ticker
   * @returns
   */
  public updateEmitter(ticker: Ticker) {
    this._updateElapsed += ticker.elapsedMS;

    if (this._updateElapsed < this._updateOptions.interval) return;

    this._spawn(this._updateElapsed);

    this.particleChildren.forEach((particle) => {
      const particleItem = particle as ParticleItem;
      if (particleItem.currentLife < particleItem.lifespan) {
        // Update Particle Physics
        particleItem.update(
          this._updateElapsed,
          this._contentFrame || undefined
        );
        // Update Environment Physics
        this._applyEnvironment(particleItem, this._updateElapsed);

        if (this.isOutOfBounds(particleItem)) {
          this._killParticle(particleItem);
        }
      } else {
        this._killParticle(particleItem);
      }
    });

    this._updateElapsed = 0;
    this.update();
  }

  /**
   *
   * @param emit
   * @returns
   */
  public start(emit: boolean = false) {
    if (this._ticker.started) return;
    this.spawn = emit;
    this._spawnElapsed = this._spawnInterval;
    this._ticker.start();
  }

  /**
   *
   */
  public pause() {
    this._ticker.stop();
  }

  /**
   *
   */
  public resume() {
    this._ticker.start();
  }

  /**
   *
   */
  public stop() {
    this.reset();
    this._ticker.stop();
  }

  /**
   *
   */
  public reset() {
    this.spawn = false;
    this._updateElapsed = 0;
    this._spawnElapsed = 0;
    this._spawnInterval =
      1000 /
      ParticleEmitter.randomFromRange(this._updateOptions.spawnRate.value);
    this._spawnVelocity = ParticleEmitter.randomFromRange(
      this._updateOptions.spawnRate.velocity
    );
    this._spawnDurationElapsed = 0;

    this.particleChildren.forEach((particle) => {
      const particleItem = particle as ParticleItem;
      this._pool.return(particleItem);
    });
    this.removeParticles(0, this.particleChildren.length);
    console.log(this.particleChildren);
  }

  /**
   *
   * @param options
   */
  public destroy(options: DestroyOptions) {
    this._ticker.remove(this.updateEmitter, this);
    super.destroy(options);
  }
}
