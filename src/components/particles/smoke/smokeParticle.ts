import { Texture } from 'pixi.js';
import { ParticleItem } from '../../../systems/particles/ParticleItem';
import { randomListItem } from '../../../utils/random';

const textureNames = [
  'smoke_00.png',
  'smoke_01.png',
  'smoke_02.png',
  'smoke_03.png',
  'smoke_04.png',
];

export class SmokeParticle extends ParticleItem {
  constructor() {
    super(Texture.from(randomListItem(textureNames as [])));
  }
}
