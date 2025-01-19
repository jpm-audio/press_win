import { Rectangle, Texture } from 'pixi.js';
import { ParticleItem } from '../../../systems/particles/ParticleItem';

const COIN_FRAMES = [
  'win_coin_seq_00000.png',
  'win_coin_seq_00001.png',
  'win_coin_seq_00002.png',
  'win_coin_seq_00003.png',
  'win_coin_seq_00004.png',
  'win_coin_seq_00005.png',
  'win_coin_seq_00006.png',
  'win_coin_seq_00007.png',
  'win_coin_seq_00008.png',
  'win_coin_seq_00009.png',
  'win_coin_seq_00010.png',
  'win_coin_seq_00011.png',
  'win_coin_seq_00012.png',
  'win_coin_seq_00013.png',
  'win_coin_seq_00014.png',
  'win_coin_seq_00015.png',
  'win_coin_seq_00016.png',
  'win_coin_seq_00017.png',
  'win_coin_seq_00018.png',
  'win_coin_seq_00019.png',
  'win_coin_seq_00020.png',
  'win_coin_seq_00021.png',
  'win_coin_seq_00022.png',
  'win_coin_seq_00023.png',
  'win_coin_seq_00024.png',
  'win_coin_seq_00025.png',
  'win_coin_seq_00026.png',
  'win_coin_seq_00027.png',
  'win_coin_seq_00028.png',
  'win_coin_seq_00029.png',
];

export class CoinParticle extends ParticleItem {
  public spriteFrameIndex: number = 0;
  public spriteFrames: string[] = COIN_FRAMES;
  public spriteFrameInterval: number = 25;
  public spriteFrameElapsed: number = 0;

  constructor() {
    super(Texture.from(COIN_FRAMES[0]));

    this.spriteFrameIndex = Math.floor(
      Math.random() * this.spriteFrames.length
    );
  }

  public nextSpriteFrame() {
    this.spriteFrameIndex++;
    if (this.spriteFrameIndex >= this.spriteFrames.length) {
      this.spriteFrameIndex = 0;
    }

    this.texture = Texture.from(this.spriteFrames[this.spriteFrameIndex]);
  }

  /**
   *
   * @param elapsedMS
   */
  public update(elapsedMS: number, contentFrame?: Rectangle) {
    super.update(elapsedMS, contentFrame);

    this.spriteFrameElapsed += elapsedMS;
    if (this.spriteFrameElapsed >= this.spriteFrameInterval) {
      this.nextSpriteFrame();
      this.spriteFrameElapsed = 0;
    }
  }
}
