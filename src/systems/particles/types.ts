import { PoolItemConstructor, Rectangle } from 'pixi.js';
import { ParticleItem } from './ParticleItem';

export type TParticleOptionRange = [number, number] | number;

export type TParticleOptionFunction = (
  particle: ParticleItem,
  elapsedMS: number
) => number;

export type TParticleOptionInitCallback = (
  particle: ParticleItem,
  contentFrame?: Rectangle
) => void;

export type TParticleOptionUpdateCallback = (
  particle: ParticleItem,
  elapsedMS: number,
  contentFrame?: Rectangle
) => void;

export interface iParticleOptionStartEnd {
  start: TParticleOptionRange;
  end: TParticleOptionRange;
}

export interface iParticleVector1Physics {
  value: TParticleOptionRange;
  velocity?: TParticleOptionRange;
  acceleration?: TParticleOptionRange;
  maxVelocity?: number;
}

export interface iParticleVector2Physics {
  x: TParticleOptionRange;
  y: TParticleOptionRange;
  velocity?: TParticleOptionRange;
  velocityX?: TParticleOptionRange;
  velocityY?: TParticleOptionRange;
  acceleration?: TParticleOptionRange;
  accelerationX?: TParticleOptionRange;
  accelerationY?: TParticleOptionRange;
  maxVelocity?: number;
  maxVelocityX?: number;
  maxVelocityY?: number;
}

export interface iParticleSpawnOptions {
  position: iParticleVector2Physics;
  scale?:
    | iParticleOptionStartEnd
    | iParticleVector2Physics
    | TParticleOptionRange;
  rotation?: iParticleVector1Physics;
  alpha?: iParticleOptionStartEnd | TParticleOptionFunction;
  color?: iParticleOptionStartEnd | TParticleOptionFunction | number[] | number;
  onInit?: TParticleOptionInitCallback;
  onUpdate?: TParticleOptionUpdateCallback;
  lifespan?: TParticleOptionRange;
}

/**
 * force - Function that returns a force that will change the acceleration of the particles.
 * spawnRate - Number of particles per second, defined by constant value, than can change with a velocity and that with accelaration.
 * interval - Update interval in milliseconds.
 */
export interface iParticleUpdateOptions {
  spawnRate: iParticleVector1Physics;
  interval: number;
  environment?: {
    affectSurface?: boolean;
    gravity?: number;
    airResistance?: number;
    windX?: number;
    windY?: number;
  };
  spawnDuration?: number; // Set time to automatically stop emitting (spawn = False) after spawn is set to True
}

/**
 *
 */
export interface iParticleEmitterOptions {
  ClassType: PoolItemConstructor<ParticleItem>;
  initialSize: number;
  maxParticles?: number;
  spawnOptions: iParticleSpawnOptions;
  updateOptions: iParticleUpdateOptions;
  contentFrame?: Rectangle;
}

export interface iParticleEmitterInitData {
  spawnOptions: iParticleSpawnOptions;
  contentFrame?: Rectangle;
}
