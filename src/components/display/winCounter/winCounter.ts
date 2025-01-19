import { DestroyOptions, Ticker } from 'pixi.js';
import FadeContainer from '../../fadeContainer/fadeContainer';
import Display from '../display/display';
import { iCountOptions, iWinCounterOptions } from './types';
import waitForCondition from '../../../utils/waitForCondition';

export default class WinCounter extends FadeContainer {
  protected _display: Display;
  protected _ticker: Ticker;
  protected _currentCount: iCountOptions | null = null;

  public get isRunning() {
    return this._currentCount !== null;
  }

  constructor(options: iWinCounterOptions) {
    super();

    this._ticker = options.ticker;
    this._display = new Display(options.content, options.valueParser);
    this.addChild(this._display);
  }

  protected _countTick(ticker: Ticker) {
    if (this._currentCount === null) return;

    this._currentCount.elapsed += ticker.elapsedMS;

    if (this._currentCount.elapsed > this._currentCount.interval) {
      this._currentCount.value += this._currentCount.tickIncrement;
      this._currentCount.elapsed = 0;

      if (this._currentCount.value < this._currentCount.targetValue) {
        this.updateCounter(this._currentCount.value);
      } else {
        this._ticker.remove(this._countTick, this);
        this.updateCounter(this._currentCount.targetValue);
        this._currentCount = null;
      }
    }
  }

  public updateCounter(value: number) {
    this._display.text = value;
  }

  public async countTo(
    targetValue: number,
    initialValue: number = 0,
    duration: number = 1000,
    interval: number = 250
  ) {
    if (this.isRunning) return;

    await this.show();

    const deltaValue = targetValue - initialValue;
    const ticks = Math.ceil(duration / interval);
    const tickIncrement = deltaValue / ticks;

    this._currentCount = {
      value: initialValue,
      targetValue,
      tickIncrement: tickIncrement,
      interval,
      elapsed: 0,
    };

    this._ticker.add(this._countTick, this);

    await waitForCondition(() => this._currentCount !== null);

    console.log('Listo!');
  }

  public destroy(options?: DestroyOptions): void {
    if (this.isRunning) {
      this._ticker.remove(this._countTick, this);
    }
    super.destroy(options);
  }
}
