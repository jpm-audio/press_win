import gsap from 'gsap';
import { Container, Sprite, Texture } from 'pixi.js';
import {
  SHINE_ANIMATION_OPTIONS,
  SYMBOL_FLOATING_ANIMATION_OPTIONS,
  SYMBOL_HIDE_ANIMATION_OPTIONS,
  SYMBOL_SHOW_ANIMATION_OPTIONS,
} from './config';
import { iFloatingAnimationOptions } from '../../../animations/floatingAnimation/types';
import FloatingAnimation from '../../../animations/floatingAnimation/floatingAnimation';

export default class Symbol extends Container {
  protected _floatingLayer: Container;
  protected _bubble: Sprite;
  protected _symbol: Sprite;
  protected _shine: Sprite;
  protected _symbolType: string = '';
  protected _currentShowHideTween: gsap.core.Tween | null = null;
  protected _floatingAnimation: FloatingAnimation;

  public get symbolType() {
    return this._symbolType;
  }

  public set symbolType(symbolType: string) {
    this._symbolType = symbolType;
    this._symbol.texture = Texture.from(`${symbolType}.png`);
  }
  constructor(symbolType: string) {
    super();

    this._floatingLayer = new Container();
    this.addChild(this._floatingLayer);

    this._floatingAnimation = new FloatingAnimation(
      this._floatingLayer,
      SYMBOL_FLOATING_ANIMATION_OPTIONS() as iFloatingAnimationOptions
    );

    this._symbol = new Sprite();
    this._symbol.anchor.set(0.5);
    this._floatingLayer.addChild(this._symbol);

    this._bubble = Sprite.from('ring.png');
    this._bubble.blendMode = 'add';
    this._bubble.anchor.set(0.5);
    this._floatingLayer.addChild(this._bubble);

    this._shine = Sprite.from('shine.png');
    this._shine.anchor.set(0.5);
    this._shine.blendMode = 'add';
    this.addChild(this._shine);

    this.symbolType = symbolType;
  }

  /**
   * Called from SymbolFactory when is requested
   */
  public init() {
    this._floatingLayer.scale.set(0);
    this._shine.alpha = 0;
    this._shine.scale.set(0);
  }

  /**
   * Called from SymbolFactory when is returned
   */
  public reset() {
    this._floatingAnimation.stop();
  }

  public async show() {
    if (this._currentShowHideTween) this._currentShowHideTween.kill();

    this._currentShowHideTween = gsap.to(
      this._floatingLayer,
      SYMBOL_SHOW_ANIMATION_OPTIONS
    );

    await this._currentShowHideTween;
    this._currentShowHideTween = null;

    this.float();
  }

  public float() {
    this._floatingAnimation.start();
  }

  public async hide() {
    if (this._currentShowHideTween) this._currentShowHideTween.kill();
    this._currentShowHideTween = null;

    // Symbol & Bubble Scale Up
    const floatinStopPromise = this._floatingAnimation.stop();
    const shinePromise = gsap.to(this._shine, SHINE_ANIMATION_OPTIONS);
    const symbolHidePromise = gsap.to(
      this._floatingLayer,
      SYMBOL_HIDE_ANIMATION_OPTIONS
    );

    await Promise.all([shinePromise, symbolHidePromise]);

    // Symbol & Bubble Disappear
    this._floatingLayer.scale.set(0);
    this._shine.alpha = 0;

    await floatinStopPromise;
  }
}
