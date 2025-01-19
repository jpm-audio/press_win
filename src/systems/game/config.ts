import { iWinCounterOptions } from '../../components/display/winCounter/types';
import { amountToString } from '../../utils/amountToString';
import { iGameConfig } from './types';
import { BitmapText, Ticker } from 'pixi.js';

export const GAME_CONFIG: iGameConfig = {
  referenceSize: {
    width: 1280,
    height: 720,
  },
  scaleResolutions: [1, 0.5],
  fileResolutionSufixes: ['100', '50'],
  audioBasePath: 'assets/audio/',
  getAssetsInitOptions: (resolutionSufix: string) => {
    return {
      basePath: 'assets/',
      manifest: {
        bundles: [
          {
            name: 'loader',
            assets: [
              {
                alias: 'loaderAssets',
                src: `sprites/loader-${resolutionSufix}.json`,
              },
            ],
          },
          {
            name: 'game',
            assets: [
              {
                alias: 'gameAssets',
                src: `sprites/game-${resolutionSufix}.json`,
              },
              {
                alias: 'ladyLuck',
                src: 'bitmapfonts/lady_luck/lady_luck.xml',
              },
            ],
          },
        ],
      },
    };
  },
  getAssetsResolutionIndex: (screenSize: {
    width: number;
    height: number;
  }): number => {
    const ratio = screenSize.height / GAME_CONFIG.referenceSize.height;
    let index = 0;

    for (let i = 0; i < GAME_CONFIG.scaleResolutions.length; i++) {
      if (ratio > GAME_CONFIG.scaleResolutions[i]) {
        break;
      }
      index = i;
    }
    return index;
  },
};

export const WIN_COUNTER_OPTIONS: iWinCounterOptions = {
  ticker: new Ticker(),
  valueParser: (value) => amountToString(value as number, 2),
  content: new BitmapText({
    text: '',
    style: {
      fontFamily: 'lady-luck',
      fontSize: 55,
      align: 'left',
    },
  }),
};
