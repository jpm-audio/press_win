import { Rectangle } from 'pixi.js';
import {
  iParticleEmitterOptions,
  TParticleOptionRange,
} from '../../../../systems/particles/types';
import { BubbleParticle } from '../bubblesParticle';
import { GAME_CONFIG } from '../../../../systems/game/config';

export const BUBBLES_PARTICLES_CONFIG: iParticleEmitterOptions = {
  ClassType: BubbleParticle,
  initialSize: 125,
  spawnOptions: {
    position: {
      x: [-100, 100],
      y: [-100, 100],
      velocityX: [-200, 200] as TParticleOptionRange,
      velocityY: [-200, 200] as TParticleOptionRange,
    },
    scale: [0.05, 0.2],
  },
  contentFrame: new Rectangle(
    -GAME_CONFIG.referenceSize.width / 2,
    -GAME_CONFIG.referenceSize.height / 2,
    GAME_CONFIG.referenceSize.width,
    GAME_CONFIG.referenceSize.height
  ),
  updateOptions: {
    environment: {
      airResistance: 0.1,
    },
    spawnDuration: 250,
    spawnRate: { value: 500 },
    interval: 32,
  },
};
