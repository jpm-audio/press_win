import {
  iParticleEmitterOptions,
  TParticleOptionRange,
} from '../../../../systems/particles/types';
import { BubbleParticle } from '../bubblesParticle';

export const DUST_PARTICLES_CONFIG: iParticleEmitterOptions = {
  ClassType: BubbleParticle,
  initialSize: 750,
  spawnOptions: {
    lifespan: [0.5, 0.75],
    position: {
      x: [-75, 75],
      y: [-75, 75],
      velocityX: [-200, 200] as TParticleOptionRange,
      velocityY: [-200, 100] as TParticleOptionRange,
      accelerationY: [-500, -1000] as TParticleOptionRange,
    },
    scale: [0.01, 0.05],
    alpha: {
      start: 1,
      end: 0,
    },
    color: [0xff0000, 0xff00ff, 0xffff00, 0xffffff],
  },
  updateOptions: {
    spawnRate: { value: 1500 },
    spawnDuration: 750,
    interval: 32,
  },
};
