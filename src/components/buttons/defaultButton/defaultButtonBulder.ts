import {
  Container,
  FillInput,
  Graphics,
  StrokeInput,
  TextStyle,
} from 'pixi.js';
import { eButtonState, iButtonBuilder } from '../types';
import { DEFAULT_BUTTON_CONFIG } from './config';
import { LocaleText } from '../../text/localeText';
import Game from '../../../systems/game/game';

export default class DefaultButtonBuilder implements iButtonBuilder {
  public getState(
    state: eButtonState,
    text: string,
    width: number,
    height: number
  ) {
    const stateContainer = new Container();

    const background = this.getBackground(state, width, height);
    background.x = -width / 2;
    background.y = -height / 2;
    stateContainer.addChild(background);

    const textEl = this.getText(state, text);
    textEl.anchor.set(0.5);
    stateContainer.addChild(textEl);

    return stateContainer;
  }

  public getBackground(state: eButtonState, width: number, height: number) {
    const graphics = new Graphics();
    const fill = DEFAULT_BUTTON_CONFIG.fill[state](width, height) as FillInput;
    const stroke = DEFAULT_BUTTON_CONFIG.stroke[state]() as StrokeInput;

    graphics.roundRect(0, 0, width, height, DEFAULT_BUTTON_CONFIG.radius);
    graphics.fill(fill);
    graphics.stroke(stroke);

    return graphics;
  }

  public getText(state: eButtonState, text: string) {
    const textStyle = DEFAULT_BUTTON_CONFIG.textStyle[state]() as TextStyle;
    const textEl = new LocaleText({
      text,
      style: textStyle,
      resolution: Game.environment.canvasResolution,
    });

    return textEl;
  }
}
