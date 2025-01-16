import { Assets, BlurFilter, Container, Graphics, Rectangle } from 'pixi.js';
import Game from '../../systems/game/game';

export default class TextureFactory {
  public static giftBoxShadow() {
    if (!Assets.cache.has('giftBoxShadow')) {
      const side = 160;
      const offset = 10;
      const blurStrength = 5;
      const renderMargin = blurStrength * 2;
      const container = new Container();
      const blurFilter = new BlurFilter();
      const shape = new Graphics();
      shape.poly([
        { x: 0, y: side / 4 - offset },
        { x: (side + offset) / 2, y: 0 },
        { x: side, y: side / 4 + offset / 2 },
        { x: (side - offset) / 2, y: side / 2 },
      ]);
      shape.fill(0x000000);

      container.addChild(shape);
      container.filters = [blurFilter];
      blurFilter.strength = blurStrength;

      const cardBackTexture = Game.renderer.generateTexture({
        target: container,
        resolution: Game.game.assetsResolution,
        frame: new Rectangle(
          -renderMargin,
          -renderMargin,
          side + renderMargin * 2,
          side / 2 + renderMargin * 2
        ),
      });
      Assets.cache.set('giftBoxShadow', cardBackTexture);
    }

    return Assets.cache.get('giftBoxShadow');
  }
}
