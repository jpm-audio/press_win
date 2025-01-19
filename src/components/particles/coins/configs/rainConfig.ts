import { Rectangle } from 'pixi.js';
import {
  iParticleEmitterOptions,
  TParticleOptionRange,
} from '../../../../systems/particles/types';
import { CoinParticle } from '../coinParticle';
import { GAME_CONFIG } from '../../../../systems/game/config';

const COINS_SIZE = 100;
const FRAME = new Rectangle(
  -GAME_CONFIG.referenceSize.width / 2 - COINS_SIZE,
  -GAME_CONFIG.referenceSize.height / 2 - COINS_SIZE,
  GAME_CONFIG.referenceSize.width + 2 * COINS_SIZE,
  GAME_CONFIG.referenceSize.height + 2 * COINS_SIZE
);

export const COINS_RAIN_PARTICLES_CONFIG: iParticleEmitterOptions = {
  ClassType: CoinParticle,
  initialSize: 75,
  spawnOptions: {
    position: {
      x: [FRAME.x, FRAME.x + FRAME.width],
      y: FRAME.y,
      velocityY: [1000, 500] as TParticleOptionRange,
    },
    scale: [0.25, 0.5],
    rotation: {
      value: [-Math.PI / 2, Math.PI / 2] as TParticleOptionRange,
      velocity: [-Math.PI, Math.PI] as TParticleOptionRange,
    },
    color: 0xdddddd,
  },
  contentFrame: FRAME,
  updateOptions: {
    spawnRate: { value: 50 },
    interval: 32,
  },
};
