import waitForTime from '../utils/waitForTime';
import { iServerInitResponse, TResponseType, TSymbolId } from './types';

export default class GameServer {
  constructor() {}

  public async init(): Promise<iServerInitResponse> {
    await waitForTime(1000);

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

  public async play() {
    await waitForTime(1500);

    return {
      type: 'play' as TResponseType,
      player: {
        balance: 60,
      },
      play: {
        id: '6542584',
        symbols: ['s03', 's02', 's03'] as TSymbolId[],
        win: {
          totalWin: 60,
          symbolWin: 30,
          winSymbols: ['s03', null, 's03'] as TSymbolId[],
        },
      },
    };
  }
}
