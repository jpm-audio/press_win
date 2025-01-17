import { Texture } from 'pixi.js';
import { ParticleItem } from '../../../systems/particles/ParticleItem';

export class BubbleParticle extends ParticleItem {
  constructor() {
    super(Texture.from('ring.png'));
  }
}
