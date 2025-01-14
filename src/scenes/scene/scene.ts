import { Container } from 'pixi.js';

export default class Scene extends Container {
  public closeTime: number = 0.5;
  public openTime: number = 0.5;

  constructor() {
    super();
    this.alpha = 0;
  }

  public async close() {
    await gsap.to(this, {
      duration: this.closeTime,
      alpha: 0,
      ease: 'power1.inOut',
    });
  }

  public async open() {
    await gsap.to(this, {
      duration: this.openTime,
      alphay: 1,
      ease: 'power1.in',
    });
  }

  public onScreenResize(_drawFrame: { width: number; height: number }) {}
}
