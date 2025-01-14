import { iGameConfig } from './types';

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
      basePath: 'assets/sprites/',
      manifest: {
        bundles: [
          {
            name: 'loader',
            assets: [
              {
                alias: 'loaderAssets',
                src: `loader-${resolutionSufix}.json`,
              },
            ],
          },
          {
            name: 'game',
            assets: [
              {
                alias: 'gameAssets',
                src: `game-${resolutionSufix}.json`,
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
