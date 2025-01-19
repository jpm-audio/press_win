import { Color, Particle, PoolItem, Rectangle, Texture } from 'pixi.js';
import { ParticleEmitter } from './ParticleEmitter';
import {
  TParticleOptionUpdateCallback,
  TParticleOptionFunction,
  iParticleEmitterInitData,
} from './types';
import { randomListItem } from '../../utils/random';

export class ParticleItem extends Particle implements PoolItem {
  protected _colorHandlers: [Color, Color] = [new Color(), new Color()];
  protected _seed: number = 0;

  public mass: number = 1;
  public velocityX: number = 0;
  public velocityY: number = 0;
  public accelerationX: number = 0;
  public accelerationY: number = 0;

  public scaleVelocityX: number = 0;
  public scaleVelocityY: number = 0;
  public scaleAccelerationX: number = 0;
  public scaleAccelerationY: number = 0;

  public rotationVelocity: number = 0;
  public rotationAcceleration: number = 0;

  public maxVelocityX: number = -1;
  public maxVelocityY: number = -1;
  public maxScaleVelocityX: number = -1;
  public maxScaleVelocityY: number = -1;
  public maxRotationVelocity: number = -1;

  public initAlpha: number = 0;
  public alphaStart: number = -1;
  public alphaEnd: number = -1;
  public alphaGetter: TParticleOptionFunction | null = null;
  public colorStart: number | null = null;
  public colorEnd: number | null = null;
  public colorGetter: TParticleOptionFunction | null = null;
  public scaleStart: number | null = null;
  public scaleEnd: number | null = null;
  public lifespan: number = 0;
  public currentLife: number = 0;
  public onUpdate: TParticleOptionUpdateCallback | null = null;

  public initX: number = 0;
  public initY: number = 0;
  public initVelocityX: number = 0;
  public initVelocityY: number = 0;
  public initScaleX: number = 0;
  public initScaleY: number = 0;
  public initRotation: number = 0;
  public initRotationVelocity: number = 0;

  public get seed() {
    return this._seed;
  }

  /**
   *
   */
  constructor(texture: Texture) {
    super(texture);
    this.anchorX = 0.5;
    this.anchorY = 0.5;
  }

  /**
   * Initialize the particle. It is called from Pool::get method.
   */
  public init(data: iParticleEmitterInitData) {
    const spawnOptions = data.spawnOptions;
    const contentFrame = data.contentFrame;

    this._seed = Math.random();

    // Position
    this.x = ParticleEmitter.randomFromRange(spawnOptions.position.x);
    this.y = ParticleEmitter.randomFromRange(spawnOptions.position.y);

    // Velocity
    if (spawnOptions.position.velocity) {
      const velocity = ParticleEmitter.randomFromRange(
        spawnOptions.position.velocity
      );
      this.velocityX = velocity;
      this.velocityY = velocity;
    } else {
      if (spawnOptions.position.velocityX) {
        this.velocityX = ParticleEmitter.randomFromRange(
          spawnOptions.position.velocityX
        );
      }
      if (spawnOptions.position.velocityY) {
        this.velocityY = ParticleEmitter.randomFromRange(
          spawnOptions.position.velocityY
        );
      }
    }

    // Acceleration
    if (spawnOptions.position.acceleration) {
      const acceleration = ParticleEmitter.randomFromRange(
        spawnOptions.position.acceleration
      );
      this.accelerationX = acceleration;
      this.accelerationY = acceleration;
    } else {
      if (spawnOptions.position.accelerationX) {
        this.accelerationX = ParticleEmitter.randomFromRange(
          spawnOptions.position.accelerationX
        );
      }
      if (spawnOptions.position.accelerationY) {
        this.accelerationY = ParticleEmitter.randomFromRange(
          spawnOptions.position.accelerationY
        );
      }
    }

    // Max Velocities
    if (spawnOptions.position.maxVelocity) {
      this.maxVelocityX = spawnOptions.position.maxVelocity;
      this.maxVelocityY = spawnOptions.position.maxVelocity;
    } else {
      if (spawnOptions.position.maxVelocityX) {
        this.maxVelocityX = spawnOptions.position.maxVelocityX;
      }
      if (spawnOptions.position.maxVelocityY) {
        this.maxVelocityY = spawnOptions.position.maxVelocityY;
      }
    }

    // Scale
    if (spawnOptions.scale) {
      //TParticleOptionRange?
      if (
        Array.isArray(spawnOptions.scale) ||
        typeof spawnOptions.scale === 'number'
      ) {
        const scale = ParticleEmitter.randomFromRange(spawnOptions.scale);
        this.scaleX = scale;
        this.scaleY = scale;
      } else if (
        spawnOptions.scale &&
        'start' in spawnOptions.scale &&
        'end' in spawnOptions.scale
      ) {
        this.scaleStart = ParticleEmitter.randomFromRange(
          spawnOptions.scale.start
        );
        this.scaleEnd = ParticleEmitter.randomFromRange(spawnOptions.scale.end);
      }
      // iParticleVector2Physics?
      else if (
        spawnOptions.scale &&
        'x' in spawnOptions.scale &&
        'y' in spawnOptions.scale
      ) {
        this.scaleX = ParticleEmitter.randomFromRange(spawnOptions.scale.x);
        this.scaleY = ParticleEmitter.randomFromRange(spawnOptions.scale.y);
        if (spawnOptions.scale.velocity) {
          const scaleVelocity = ParticleEmitter.randomFromRange(
            spawnOptions.scale.velocity
          );
          this.scaleVelocityX = scaleVelocity;
          this.scaleVelocityY = scaleVelocity;
        } else {
          if (spawnOptions.scale.velocityX) {
            this.scaleVelocityX = ParticleEmitter.randomFromRange(
              spawnOptions.scale.velocityX
            );
          }
          if (spawnOptions.scale.velocityY) {
            this.scaleVelocityY = ParticleEmitter.randomFromRange(
              spawnOptions.scale.velocityY
            );
          }
        }

        if (spawnOptions.scale.acceleration) {
          const scaleAcceleration = ParticleEmitter.randomFromRange(
            spawnOptions.scale.acceleration
          );
          this.scaleAccelerationX = scaleAcceleration;
          this.scaleAccelerationY = scaleAcceleration;
        } else {
          if (spawnOptions.scale.accelerationX) {
            this.scaleAccelerationX = ParticleEmitter.randomFromRange(
              spawnOptions.scale.accelerationX
            );
          }
          if (spawnOptions.scale.accelerationY) {
            this.scaleAccelerationY = ParticleEmitter.randomFromRange(
              spawnOptions.scale.accelerationY
            );
          }
        }

        if (spawnOptions.scale.maxVelocity) {
          this.maxScaleVelocityX = spawnOptions.scale.maxVelocity;
          this.maxScaleVelocityY = spawnOptions.scale.maxVelocity;
        } else {
          if (spawnOptions.scale.maxVelocityX) {
            this.maxScaleVelocityX = spawnOptions.scale.maxVelocityX;
          }
          if (spawnOptions.scale.maxVelocityY) {
            this.maxScaleVelocityY = spawnOptions.scale.maxVelocityY;
          }
        }
      }
    }

    // Rotation
    if (spawnOptions.rotation) {
      this.rotation = ParticleEmitter.randomFromRange(
        spawnOptions.rotation.value
      );
      if (spawnOptions.rotation.velocity) {
        this.rotationVelocity = ParticleEmitter.randomFromRange(
          spawnOptions.rotation.velocity
        );
      }
      if (spawnOptions.rotation.acceleration) {
        this.rotationAcceleration = ParticleEmitter.randomFromRange(
          spawnOptions.rotation.acceleration
        );
      }
      if (spawnOptions.rotation.maxVelocity) {
        this.maxRotationVelocity = spawnOptions.rotation.maxVelocity;
      }
    }

    // Alpha
    if (spawnOptions.alpha) {
      if (typeof spawnOptions.alpha === 'function') {
        this.alphaGetter = spawnOptions.alpha;
      } else {
        this.alphaStart = ParticleEmitter.randomFromRange(
          spawnOptions.alpha.start
        );
        this.alphaEnd = ParticleEmitter.randomFromRange(spawnOptions.alpha.end);
      }
    }

    // Color
    if (spawnOptions.color) {
      if (typeof spawnOptions.color === 'function') {
        this.colorGetter = spawnOptions.color;
      } else if (Array.isArray(spawnOptions.color)) {
        this.tint = randomListItem(spawnOptions.color as []);
      } else if (typeof spawnOptions.color === 'number') {
        this.tint = spawnOptions.color;
      } else if (spawnOptions.color.start && spawnOptions.color.end) {
        this.colorStart = ParticleEmitter.randomFromRange(
          spawnOptions.color.start
        );
        this.colorEnd = ParticleEmitter.randomFromRange(spawnOptions.color.end);
      }
    }

    // Lifespan
    if (spawnOptions.lifespan) {
      this.lifespan = ParticleEmitter.randomFromRange(spawnOptions.lifespan);
    }

    this.initX = this.x;
    this.initY = this.y;
    this.initVelocityX = this.velocityX;
    this.initVelocityY = this.velocityY;
    this.initScaleX = this.scaleX;
    this.initScaleY = this.scaleY;
    this.initRotation = this.rotation;
    this.initRotationVelocity = this.rotationVelocity;

    // On Init
    if (spawnOptions.onInit) {
      spawnOptions.onInit(this, contentFrame);
    }

    // On Update
    if (spawnOptions.onUpdate) {
      this.onUpdate = spawnOptions.onUpdate;
    }
  }

  /**
   *
   * @param elapsedMS
   */
  public update(elapsedMS: number, contentFrame?: Rectangle) {
    const elapsedSec = elapsedMS / 1000;

    // Lifespan
    this.currentLife += elapsedSec;
    const lifePercent = Math.min(this.currentLife / this.lifespan, 1);

    // Update Position
    this.x += this.velocityX * elapsedSec;
    this.y += this.velocityY * elapsedSec;
    this.velocityX += this.accelerationX * elapsedSec;
    this.velocityY += this.accelerationY * elapsedSec;

    // Update Scale
    if (this.scaleStart !== null && this.scaleEnd !== null) {
      this.scaleX =
        this.scaleStart + (this.scaleEnd - this.scaleStart) * lifePercent;
      this.scaleY =
        this.scaleStart + (this.scaleEnd - this.scaleStart) * lifePercent;
    } else {
      this.scaleX += this.scaleVelocityX * elapsedSec;
      this.scaleY += this.scaleVelocityY * elapsedSec;
      this.scaleVelocityX += this.scaleAccelerationX * elapsedSec;
      this.scaleVelocityY += this.scaleAccelerationY * elapsedSec;
    }

    // Update Rotation
    this.rotation += this.rotationVelocity * elapsedSec;
    this.rotationVelocity += this.rotationAcceleration * elapsedSec;

    // Update Alpha
    if (this.alphaGetter) {
      this.alpha = this.alphaGetter(this, elapsedMS);
    } else if (this.alphaStart > -1 && this.alphaEnd > -1) {
      this.alpha =
        this.alphaStart + (this.alphaEnd - this.alphaStart) * lifePercent;
    }

    // Update Color
    if (this.colorGetter) {
      this._colorHandlers[0].value = this.colorGetter(this, elapsedMS);
      this.tint = this._colorHandlers[0];
    } else if (this.colorStart !== null && this.colorEnd !== null) {
      this._colorHandlers[0].value = this.colorStart;
      this._colorHandlers[1].value = this.colorEnd;
      const colorTransition = [
        this._colorHandlers[0].red +
          (this._colorHandlers[1].red - this._colorHandlers[0].red) *
            lifePercent,
        this._colorHandlers[0].green +
          (this._colorHandlers[1].green - this._colorHandlers[0].green) *
            lifePercent,
        this._colorHandlers[0].blue +
          (this._colorHandlers[1].blue - this._colorHandlers[0].blue) *
            lifePercent,
        this._colorHandlers[0].alpha +
          (this._colorHandlers[1].alpha - this._colorHandlers[0].alpha) *
            lifePercent,
      ];

      this._colorHandlers[0].value = colorTransition;
      this.tint = this._colorHandlers[0];
    }

    // Max Velocities
    if (this.maxVelocityX >= 0) {
      this.velocityX = Math.min(this.velocityX, this.maxVelocityX);
    }
    if (this.maxVelocityY >= 0) {
      this.velocityY = Math.min(this.velocityY, this.maxVelocityY);
    }
    if (this.maxScaleVelocityX >= 0) {
      this.scaleVelocityX = Math.min(
        this.scaleVelocityX,
        this.maxScaleVelocityX
      );
    }
    if (this.maxScaleVelocityY >= 0) {
      this.scaleVelocityY = Math.min(
        this.scaleVelocityY,
        this.maxScaleVelocityY
      );
    }
    if (this.maxRotationVelocity >= 0) {
      this.rotationVelocity = Math.min(
        this.rotationVelocity,
        this.maxRotationVelocity
      );
    }

    // On Update
    if (this.onUpdate) {
      this.onUpdate(this, elapsedMS, contentFrame);
    }
  }

  /**
   * Reset all particle values to default. It is called from Pool::reset method.
   */
  public reset() {
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleVelocityX = 0;
    this.scaleVelocityY = 0;
    this.scaleAccelerationX = 0;
    this.scaleAccelerationY = 0;
    this.rotation = 0;
    this.rotationVelocity = 0;
    this.rotationAcceleration = 0;
    this.maxVelocityX = -1;
    this.maxVelocityY = -1;
    this.maxScaleVelocityX = -1;
    this.maxScaleVelocityY = -1;
    this.maxRotationVelocity = -1;
    this.alphaStart = -1;
    this.alphaEnd = -1;
    this.alphaGetter = null;
    this.alpha = 1;
    this.tint = 0xffffff;
    this.colorStart = null;
    this.colorEnd = null;
    this.colorGetter = null;
    this.scaleStart = null;
    this.scaleEnd = null;
    this.lifespan = Infinity;
    this.currentLife = 0;
  }
}
