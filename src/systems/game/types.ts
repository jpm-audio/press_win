import { AssetInitOptions, Container, Graphics, Sprite } from 'pixi.js';

export type TPixiElement = Container | Sprite | Graphics;

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

export enum eGameEvents {
  LOADING = 'gameEventLoading',
  LOADED = 'gameEventLoaded',
  READY = 'gameEventReady',
}
