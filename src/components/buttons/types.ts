import { Container, FillInput, StrokeInput, TextStyleOptions } from 'pixi.js';

export type TButtonStatesOptions = {
  [key in eButtonState]: Container;
};

export interface iButtonBuilderConfig {
  radius: number;
  fill: {
    [key in eButtonState]: (width: number, height: number) => FillInput;
  };
  stroke: {
    [key in eButtonState]: () => StrokeInput;
  };
  textStyle: {
    [key in eButtonState]: () => TextStyleOptions;
  };
}

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
