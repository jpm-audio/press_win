import { AssetInitOptions } from 'pixi.js';

export interface iGameConfig {
  referenceSize: { width: number; height: number };
  scaleResolutions: number[];
  fileResolutionSufixes: string[];
  getAssetsResolutionIndex: (screenSize: {
    width: number;
    height: number;
  }) => number;
  audioBasePath: string;
  getAssetsInitOptions: (resolutionSufix: string) => AssetInitOptions;
}
