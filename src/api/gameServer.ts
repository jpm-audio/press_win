import waitForTime from '../utils/waitForTime';
import { iServerInitResponse, iServerPlayResponse } from './types';
import initResponses from '../data/init.json';
import playResponses from '../data/play.json';

/**
 * Fake Game Server
 *
 * It is a fake server that returns random responses from the data files.
 * It is used to simulate a real server connexion and responses with a random delay configured.
 */
export default class GameServer {
  protected _responseDelayRange: [number, number] = [10, 100]; //[1000, 2000];
  public initResponse: iServerInitResponse;
  public playResponses: iServerPlayResponse[];
  public playResponseIndex: number = 0;

  public getNextPlayIndex() {
    const index = this.playResponseIndex++;

    if (index >= this.playResponses.length) {
      this.playResponseIndex = 0;
    }

    return index;
  }

  constructor() {
    this.initResponse = initResponses.responses[
      Math.floor(Math.random() * initResponses.responses.length)
    ] as iServerInitResponse;
    this.playResponses = playResponses.responses as iServerPlayResponse[];

    // Set first play response as the init play response
    this.initResponse.initPlay = this.playResponses[0];
    this.playResponseIndex = this.getNextPlayIndex();
  }

  protected _getRandomDelay() {
    return this._responseDelayRange[
      Math.floor(Math.random() * this._responseDelayRange.length)
    ];
  }

  public async init(): Promise<iServerInitResponse> {
    await waitForTime(this._getRandomDelay());
    return this.initResponse;
  }

  public async play(): Promise<iServerPlayResponse> {
    await waitForTime(this._getRandomDelay());
    const playResponse = this.playResponses[this.playResponseIndex];
    this.playResponseIndex = this.getNextPlayIndex();

    return playResponse;
  }
}
