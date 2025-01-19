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

// GAME EVENTS

export interface iEventInfo {
  event: eGameEvents;
}

// --> GAME ACTIONS
export enum eGameActionEvents {
  SYMBOLS_REVEALED = 'gameEventSymbolsRevealed',
  PLAY_ACTION = 'gameEventPlayAction',
}

// --> GAME STATES
// WAITING -> LOADING -> READY -> SHOWING_RESULTS -> RELEASED -> PLAYING -> READY...
//
// WAITING: Waiting for the game to be loaded
// LOADING: Loading the game assets
// READY: Game is ready to be played and symbols are set and ready but "hidden"
// SHOWING_RESULTS: Showing the results of the play after all symbols are revealed
// REVEASED: All symbols are revealed and game is waiting for the play user action
// PLAYING: Game is performing the play action and server request.
export enum eGameStates {
  WAITING = 'gameStateWaiting',
  LOADING = 'gameStateLoading',
  READY = 'gameStateReady',
  SHOWING_RESULTS = 'gameStateShowingResults',
  REVEALED = 'gameStateReleased',
  PLAYING = 'gameStatePlaying',
}

export enum eGameEvents {
  STATE_CHANGE = 'gameEventStateChange',
  ERROR = 'gameEventError',
}

export interface iGameEventErrorInfo extends iEventInfo {
  error: string;
}

export interface iGameEventStateChangeInfo extends iEventInfo {
  prevState: eGameStates;
  state: eGameStates;
}
