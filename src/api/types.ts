export type TSymbolId =
  | 's00'
  | 's01'
  | 's02'
  | 's03'
  | 's04'
  | 's05'
  | 's06'
  | 's07'
  | 's08'
  | 's09'
  | 's10';

export interface iGameDefinition {
  symbols: TSymbolId[];
}

export type TResponseType = 'init' | 'play';

export interface iPlayerInfo {
  balance: number;
}

export interface iPlayInfo {
  id: string;
  symbols: TSymbolId[];
  win?: {
    totalWin: number;
    symbolWin: number;
    winSymbols: (TSymbolId | null)[];
  };
}

export interface iServerInitResponse {
  type: TResponseType;
  player: iPlayerInfo;
  play: iPlayInfo;
  definition: iGameDefinition;
}

export interface iServerPlayResponse {
  type: TResponseType;
  player: iPlayerInfo;
  play: iPlayInfo;
}
