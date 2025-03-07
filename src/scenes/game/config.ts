import { iMessageBoxOptions } from '../../components/messageBox/types';
import { GAME_CONFIG } from '../../systems/game/config';
import { eGameSceneModes } from './types';

const BIG_WIN_TRESHOLD = 1000;

export const WIN_ANIMATION_CONFIG = (winAmount: number) => {
  const isBigWin = winAmount >= BIG_WIN_TRESHOLD;
  return {
    isBigWin,
    winCountTime: isBigWin ? 6000 : 3000,
    gameMode: isBigWin ? eGameSceneModes.BIG_WIN : eGameSceneModes.WIN,
  };
};

export const MESSAGE_BOX_CONFIG: iMessageBoxOptions = {
  showAnimationVars: {
    duration: 0.5,
    ease: 'power1.in',
  },
  hideAnimationVars: {
    duration: 0.5,
    ease: 'power1.out',
  },
  textOptions: {
    text: '',
    style: {
      fontFamily: 'Do Hyeon',
      fontSize: 28,
      fill: 0xffffff,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: GAME_CONFIG.referenceSize.width * 0.8,
    },
  },
};

export const GAME_MESSAGES = {
  initialState: () => {
    const messages = [
      'initialMessage1',
      'initialMessage2',
      'initialMessage3',
      'initialMessage4',
      'initialMessage5',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },
  playState: () => {
    const messages = [
      'playMessage1',
      'playMessage2',
      'playMessage3',
      'playMessage4',
      'playMessage5',
      'playMessage6',
      'playMessage7',
      'playMessage8',
      'playMessage9',
      'playMessage10',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },
  winState: () => {
    const messages = [
      'winMessage1',
      'winMessage2',
      'winMessage3',
      'winMessage4',
      'winMessage5',
      'winMessage6',
      'winMessage7',
      'winMessage8',
      'winMessage9',
      'winMessage10',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },
};
