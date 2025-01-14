import { EventEmitter } from "pixi.js";

export enum eLockManagerEvents {
  DISABLE = "lockManagerDisable",
  ENABLE = "lockManagerEnable",
}

export type TLockId = number | string;

/**
 * Handle the disable state of a comple environment.
 */
export class LockManager extends EventEmitter {
  protected _locksStack: TLockId[] = [];

  public get locks() {
    return this._locksStack.splice(0);
  }

  public get isEnabled() {
    return this._locksStack.length === 0;
  }

  public get isDisabled() {
    return this._locksStack.length > 0;
  }

  protected _getLockId() {
    return Date.now();
  }

  /**
   * It will trigger a disabled event in case it is not already disabled.
   *
   * @param customLockId - You can provide your custom lock id.
   * @returns TLockId - Use it for unlocking on enable call.
   */
  public disable(customLockId?: TLockId): TLockId {
    const lockId = customLockId || this._getLockId();
    if (!customLockId) {
      console.warn("LockManager::disable - Lock id not provided");
    }

    if (this.isEnabled) {
      this.emit(eLockManagerEvents.DISABLE, lockId, this.locks);
    }

    // Check whether lockId already exists
    else if (this._locksStack.indexOf(lockId) !== -1) {
      return lockId;
    }

    this._locksStack.push(lockId);

    return lockId;
  }

  /**
   * Provided a lock id, it will remove the lock id and trigger an enable event in case no more lock ids are still set.
   *
   * @param lockId
   * @returns
   */
  public enable(lockId: TLockId) {
    // Enabled?
    if (this.isEnabled) return false;

    //Exist lock id?
    const index = this._locksStack.indexOf(lockId);
    if (index !== -1) {
      // Remove lock id
      this._locksStack.splice(index, 1);
    }

    if (this.isEnabled) {
      this.emit(eLockManagerEvents.ENABLE, lockId);
      return true;
    }
    return false;
  }
}
