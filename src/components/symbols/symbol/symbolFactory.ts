import Symbol from './symbol';
import { iPoolSymbol } from './types';

export default class SymbolFactory {
  protected static _pool: iPoolSymbol[] = [];

  public static spawn(symbolType: string): iPoolSymbol {
    const poolSymbol = {
      used: false,
      symbol: new Symbol(symbolType),
    };
    this._pool.push(poolSymbol);
    return poolSymbol;
  }

  public static get(symbolType: string): Symbol {
    // Find a symbol in the pool
    let poolSymbol = SymbolFactory._pool.find(
      (s) => s.used === false && s.symbol.symbolType === symbolType
    );

    // If not found, create a new one
    if (!poolSymbol) {
      poolSymbol = SymbolFactory.spawn(symbolType);
    }

    // Init the symbol and set it as used
    poolSymbol.used = true;
    poolSymbol.symbol.init();

    return poolSymbol.symbol;
  }

  public static return(symbol: Symbol) {
    // Reset the symbol
    symbol.reset();

    // Set the symbol as unused
    const poolSymbol = SymbolFactory._pool.find((s) => s.symbol === symbol);
    if (poolSymbol) {
      poolSymbol.used = false;
    }
  }
}
