import {
  iParticleEmitterOptions,
  TParticleOptionRange,
} from '../../../../systems/particles/types';
import { SmokeParticle } from '../smokeParticle';

export const SMOKE_PARTICLES_CONFIG: iParticleEmitterOptions = {
  ClassType: SmokeParticle,
  initialSize: 250,
  spawnOptions: {
    lifespan: 0.75,
    position: {
      x: [-50, 50],
      y: [-50, 50],
      velocityX: [-300, 300] as TParticleOptionRange,
      velocityY: [-300, 200] as TParticleOptionRange,
    },
    scale: {
      x: 0.5,
      y: 0.5,
      velocity: 2,
    },
    rotation: {
      value: [-Math.PI, Math.PI] as TParticleOptionRange,
      velocity: [-Math.PI / 2, Math.PI / 2] as TParticleOptionRange,
    },
    color: {
      start: 0xfe00fe,
      end: 0xffffff,
    },
    alpha: {
      start: 1,
      end: 0,
    },
  },
  updateOptions: {
    environment: {
      airResistance: 0.2,
    },
    spawnDuration: 250,
    spawnRate: { value: 1000 },
    interval: 32,
  },
};
