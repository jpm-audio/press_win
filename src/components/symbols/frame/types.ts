export interface iSymbolsFrameOptions {
  numSymbols: number;
  symbolTypes: string[];
  initialState: string[];
}

export enum eSymbolsFrameEvents {
  ALL_SYMBOLS_REVEALED = 'symbolsFrameEventAllSymbolsRevealed',
}
