import { GAME_CONFIG } from '../../systems/game/config';

export const MESSAGE_BOX_CONFIG = {
  showTime: 0.5,
  hideTime: 0.5,
  textStyle: {
    fontFamily: 'Do Hyeon',
    fontSize: 28,
    fill: 0xffffff,
    align: 'center',
    wordWrap: true,
    wordWrapWidth: GAME_CONFIG.referenceSize.width * 0.8,
  },
  messages: {
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
  },
};
