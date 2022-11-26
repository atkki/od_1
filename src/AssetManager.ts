import { Loader, LoaderResource } from 'pixi.js';

interface IAssetListRow {
  readonly name: string;
  readonly url: string;
}

class AssetManager {
  public static addList(list: Array<IAssetListRow>): void {
    for (const row of list) {
      Loader.shared.add(row.name, row.url);
    }
  }

  public static async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      Loader.shared.onComplete.once(() => {
        resolve();
      });

      Loader.shared.onError.once(() => {
        reject();
      });

      Loader.shared.load();
    });
  }

  public static getResource(key: string): LoaderResource {
    return Loader.shared.resources[key];
  }
}

export { AssetManager };
