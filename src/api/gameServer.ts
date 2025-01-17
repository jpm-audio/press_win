import { iServerInitResponse } from './types';

export default class GameServer {
  constructor() {}

  public async init(): Promise<iServerInitResponse> {
    return {
      type: 'init',
      player: {
        balance: 0,
      },
      play: {
        id: '6542584',
        symbols: ['s05', 's02', 's09'],
        win: {
          totalWin: 0,
          symbolWin: 0,
          winSymbols: [null, null, null],
        },
      },
      definition: {
        symbols: [
          's00',
          's01',
          's02',
          's03',
          's04',
          's05',
          's06',
          's07',
          's08',
          's09',
          's10',
        ],
      },
    };
  }
}
