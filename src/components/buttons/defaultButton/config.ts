import { FillGradient } from 'pixi.js';
import { eButtonState } from '../types';

export const DEFAULT_BUTTON_CONFIG = {
  radius: 5,
  fill: {
    [eButtonState.NORMAL]: (width: number, height: number) => {
      const grd = new FillGradient(width / 2, 0, width / 2, height);
      grd.addColorStop(0, 0x1e5799);
      grd.addColorStop(0.5, 0x2989d8);
      grd.addColorStop(0.51, 0x207cca);
      grd.addColorStop(1, 0x7db9e8);
      return grd;
    },
    [eButtonState.HOVER]: (width: number, height: number) => {
      const grd = new FillGradient(width / 2, 0, width / 2, height);
      grd.addColorStop(0, 0x7db9e8);
      grd.addColorStop(0.5, 0x207cca);
      grd.addColorStop(0.51, 0x2989d8);
      grd.addColorStop(1, 0x1e5799);

      return grd;
    },
    [eButtonState.PRESSED]: (width: number, height: number) => {
      const grd = new FillGradient(width / 2, 0, width / 2, height);
      grd.addColorStop(0, 0x7db9e8);
      grd.addColorStop(1, 0xffffff);
      return grd;
    },
    [eButtonState.DISABLED]: (width: number, height: number) => {
      const grd = new FillGradient(width / 2, 0, width / 2, height);
      grd.addColorStop(0, 0x999999);
      grd.addColorStop(0.5, 0x898989);
      grd.addColorStop(0.51, 0x7c7c7c);
      grd.addColorStop(1, 0x7db9e8);
      return grd;
    },
  },
  stroke: {
    [eButtonState.NORMAL]: () => {
      return {
        color: 0xffffff,
      };
    },
    [eButtonState.HOVER]: () => {
      return {
        color: 0xffffff,
      };
    },
    [eButtonState.PRESSED]: () => {
      return {
        color: 0x1e5799,
      };
    },
    [eButtonState.DISABLED]: () => {
      return {
        color: 0xffffff,
      };
    },
  },
  textStyle: {
    [eButtonState.NORMAL]: () => {
      return {
        fontFamily: 'Do Hyeon',
        fontSize: 34,
        fontWeight: 'bold',
        fill: 0xffffff,
      };
    },
    [eButtonState.HOVER]: () => {
      return {
        fontFamily: 'Do Hyeon',
        fontSize: 34,
        fontWeight: 'bold',
        fill: 0xffffff,
      };
    },
    [eButtonState.PRESSED]: () => {
      return {
        fontFamily: 'Do Hyeon',
        fontSize: 34,
        fontWeight: 'bold',
        fill: 0xffffff,
      };
    },
    [eButtonState.DISABLED]: () => {
      return {
        fontFamily: 'Do Hyeon',
        fontSize: 34,
        fontWeight: 'bold',
        fill: 0xffffff,
      };
    },
  },
};
