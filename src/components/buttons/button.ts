import { Container } from 'pixi.js';
import { eButtonState, iButtonOptions, TButtonStatesOptions } from './types';

export default class Button extends Container {
  protected _states: Map<eButtonState, Container> = new Map();
  protected _currentState!: eButtonState;

  public get isEnabled() {
    return this.eventMode !== 'none';
  }

  constructor(options: iButtonOptions) {
    super();

    const initState = options.initState || eButtonState.NORMAL;
    this._initStates(options.states);

    // Set initial state
    if (initState !== eButtonState.DISABLED) {
      this.enable();
    } else {
      this.disable();
    }

    // Add event listeners
    this.on('pointerover', this._onHover, this);
    this.on('pointerout', this._onOut, this);
    this.on('pointerdown', this._onPress, this);
    this.on('pointerup', this._onRelease, this);
    this.on('pointerupoutside', this._onRelease, this);
  }

  protected _initStates(states: TButtonStatesOptions) {
    this._states.set(eButtonState.NORMAL, states[eButtonState.NORMAL]);
    this._states.set(eButtonState.HOVER, states[eButtonState.HOVER]);
    this._states.set(eButtonState.PRESSED, states[eButtonState.PRESSED]);
    this._states.set(eButtonState.DISABLED, states[eButtonState.DISABLED]);

    const stateNormal = this._states.get(eButtonState.NORMAL) as Container;
    const stateHover = this._states.get(eButtonState.HOVER) as Container;
    const statePressed = this._states.get(eButtonState.PRESSED) as Container;
    const stateDisabled = this._states.get(eButtonState.DISABLED) as Container;

    this.addChild(stateNormal);
    this.addChild(stateHover);
    this.addChild(statePressed);
    this.addChild(stateDisabled);

    stateNormal.visible = false;
    stateHover.visible = false;
    statePressed.visible = false;
    stateDisabled.visible = false;
  }

  protected _setState(state: eButtonState): void {
    if (this._currentState !== state) {
      const newState = this._states.get(state) as Container;
      const prevState =
        this._currentState !== undefined
          ? this._states.get(this._currentState)
          : null;

      newState.visible = true;
      if (prevState) {
        prevState.visible = false;
      }

      this._currentState = state;
    }
  }

  protected _onHover(): void {
    if (this.isEnabled) {
      this._setState(eButtonState.HOVER);
    }
  }

  protected _onOut(): void {
    if (this.isEnabled) {
      this._setState(eButtonState.NORMAL);
    }
  }

  protected _onPress(): void {
    if (this.isEnabled) {
      this._setState(eButtonState.PRESSED);
    }
  }

  protected _onRelease(): void {
    if (this.isEnabled) {
      this._setState(eButtonState.HOVER);
    }
  }

  public enable(): void {
    this.eventMode = 'static';
    this._setState(eButtonState.NORMAL);
  }

  public disable(): void {
    this.eventMode = 'none';
    this._setState(eButtonState.DISABLED);
  }
}
