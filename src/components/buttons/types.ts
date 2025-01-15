import { Container } from 'pixi.js';

export type TButtonStatesOptions = {
  [key in eButtonState]: Container;
};

export interface iButtonOptions {
  states: TButtonStatesOptions;
  initState?: eButtonState;
}

export enum eButtonState {
  NORMAL = 'buttonStateNormal',
  HOVER = 'buttonStateHover',
  PRESSED = 'buttonStatePressed',
  DISABLED = 'buttonStateDisabled',
}

export interface iButtonBuilder {
  getState(
    state: eButtonState,
    text: string,
    width: number,
    height: number
  ): Container;
}

export interface iButtonFactoryOptions {
  buttonBuilder: iButtonBuilder;
  text: string;
  width: number;
  height: number;
}
