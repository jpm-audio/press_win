export class LocalStorage {
  public static prefix = "";
  protected _itemId: string;

  constructor(itemId: string) {
    this._itemId = itemId;
  }

  public get parsedItemId() {
    return `${LocalStorage.prefix}-${this._itemId}`;
  }

  public get() {
    const dataString = localStorage.getItem(this.parsedItemId);
    return dataString ? JSON.parse(dataString) : null;
  }

  public set(data: string | number | [] | object | null) {
    if (data === undefined || data === null) data = "";
    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    localStorage.setItem(this.parsedItemId, dataString);
  }

  public delete() {
    localStorage.removeItem(this.parsedItemId);
  }
}
