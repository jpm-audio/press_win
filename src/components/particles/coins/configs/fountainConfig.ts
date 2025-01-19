import { Rectangle } from 'pixi.js';
import {
  iParticleEmitterOptions,
  TParticleOptionRange,
} from '../../../../systems/particles/types';
import { CoinParticle } from '../coinParticle';
import { GAME_CONFIG } from '../../../../systems/game/config';

const COINS_SIZE = 100;

export const COINS_FOUNTAIN_PARTICLES_CONFIG: iParticleEmitterOptions = {
  ClassType: CoinParticle,
  initialSize: 250,
  spawnOptions: {
    position: {
      x: [-10, 10],
      y: [-10, 10],
      velocityX: [-200, 200] as TParticleOptionRange,
      velocityY: [-750, -150] as TParticleOptionRange,
      accelerationX: [-150, 150] as TParticleOptionRange,
    },
    scale: [0.25, 0.5],
  },
  contentFrame: new Rectangle(
    -GAME_CONFIG.referenceSize.width / 2 - COINS_SIZE,
    -GAME_CONFIG.referenceSize.height / 2 - COINS_SIZE,
    GAME_CONFIG.referenceSize.width + 2 * COINS_SIZE,
    GAME_CONFIG.referenceSize.height + 2 * COINS_SIZE
  ),
  updateOptions: {
    environment: {
      gravity: 750,
    },
    spawnRate: { value: 30 },
    interval: 32,
  },
};
