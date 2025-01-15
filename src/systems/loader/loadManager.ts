import { AssetInitOptions, Assets, AssetsManifest } from 'pixi.js';

export default class LoadManager {
  protected _assetsInitOptions!: AssetInitOptions;

  public init(assetsInitOptions: AssetInitOptions) {
    this._assetsInitOptions = assetsInitOptions;
    Assets.init(assetsInitOptions);
    return this;
  }

  public async loadByBundleIndex(
    bundleIndex: number,
    onProgress?: (progress: number) => void
  ) {
    const assetsManifest = this._assetsInitOptions.manifest as AssetsManifest;

    await Assets.loadBundle(
      assetsManifest.bundles[bundleIndex].name,
      onProgress
    );
  }
}
