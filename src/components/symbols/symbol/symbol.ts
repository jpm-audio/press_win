import gsap from 'gsap';
import { Container, Sprite, Texture } from 'pixi.js';
import {
  SHINE_ANIMATION_OPTIONS,
  SYMBOL_DISOLVE_ANIMATION_OPTIONS,
  SYMBOL_EXPLODE_ANIMATION_OPTIONS,
  SYMBOL_FLOATING_ANIMATION_OPTIONS,
  SYMBOL_REDUCE_ANIMATION_OPTIONS,
  SYMBOL_SHOW_ANIMATION_OPTIONS,
} from './config';
import { iFloatingAnimationOptions } from '../../../animations/floatingAnimation/types';
import FloatingAnimation from '../../../animations/floatingAnimation/floatingAnimation';

/**
 * Symbol
 *
 * A symbol that can be shown and hidden.
 */
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

  /**
   * Constructor
   *
   * @param symbolType
   */
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
   * Utility function to handle the show and hide animations,
   * by just passing the tween vars info.
   *
   * @param vars
   */
  protected async _showHideAnimation(vars: gsap.TweenVars) {
    this._cancelShowHideAnimation();

    this._currentShowHideTween = gsap.to(this._floatingLayer, vars);

    await this._currentShowHideTween;
    this._currentShowHideTween = null;
  }

  /**
   * Utility function to cancel any show and hide animation.
   */
  protected _cancelShowHideAnimation() {
    if (this._currentShowHideTween) {
      this._currentShowHideTween.kill();
      this._currentShowHideTween = null;
    }
  }

  /**
   * Called from SymbolFactory when is requested
   */
  public init() {
    this._floatingLayer.scale.set(0);
    this._floatingLayer.alpha = 1;
    this._shine.alpha = 0;
    this._shine.scale.set(0);
  }

  /**
   * Starts the floating animation loop.
   */
  public float() {
    this._floatingAnimation.start();
  }

  /**
   * Symbol Showing animation, it is scale in, it also takes care to init floating animation.
   */
  public async show() {
    await this._showHideAnimation(SYMBOL_SHOW_ANIMATION_OPTIONS);
    this.float();
  }

  /**
   * Symbol Exploding animation
   */
  public async explode() {
    // Symbol & Bubble Scale Up
    const floatinStopPromise = this._floatingAnimation.stop();
    const shinePromise = gsap.to(this._shine, SHINE_ANIMATION_OPTIONS);
    const symbolHidePromise = this._showHideAnimation(
      SYMBOL_EXPLODE_ANIMATION_OPTIONS
    );

    await Promise.all([shinePromise, symbolHidePromise]);

    // Symbol & Bubble Disappear
    this._floatingLayer.scale.set(0);
    this._shine.alpha = 0;

    await floatinStopPromise;
  }

  /**
   * Symbol Disolving animation, it is the alpha fading out animation
   */
  public async disolve() {
    await this._showHideAnimation(SYMBOL_DISOLVE_ANIMATION_OPTIONS);
    this._floatingAnimation.stop();
  }

  /**
   * Symbol Reducing animation, it is a scale out animation
   */
  public async reduce(duration: number = 1) {
    await this._showHideAnimation({
      ...SYMBOL_REDUCE_ANIMATION_OPTIONS,
      ...{ duration },
    });
    await this._floatingAnimation.stop();
  }

  /**
   * Called from SymbolFactory when is returned
   */
  public reset() {
    this._cancelShowHideAnimation();
    this._floatingAnimation.stop();
  }
}
