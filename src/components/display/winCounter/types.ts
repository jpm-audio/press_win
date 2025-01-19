import { BitmapText, Text, Ticker } from 'pixi.js';
import { TDisplayValueParser } from '../display/types';

export interface iCountOptions {
  value: number;
  targetValue: number;
  tickIncrement: number;
  interval: number;
  elapsed: number;
}

export interface iWinCounterOptions {
  ticker: Ticker;
  valueParser: TDisplayValueParser;
  content: Text | BitmapText;
}
