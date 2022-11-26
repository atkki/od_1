import { Application, IApplicationOptions } from 'pixi.js';
import { AssetManager } from './AssetManager';
import { Game } from './Game';
import scaleToWindow from './utils/scaleToWindow';

class App {
  private config: IApplicationOptions = {
    width: 1024,
    height: 768,
    antialias: false,
    resolution: 1,
    backgroundColor: 0xffffff,
  };
  private readonly app: Application;
  private readonly game: Game;

  constructor() {
    this.app = new Application(this.config);
    this.game = new Game(this.app);

    window.addEventListener('load', (): void => {
      this.load();
    });

    window.addEventListener('resize', (): void => {
      scaleToWindow(this.app.renderer.view);
    });
  }

  private async load(): Promise<void> {
    document.body.appendChild(this.app.view);
    scaleToWindow(this.app.renderer.view);

    AssetManager.addList([
      { name: 'background', url: './assets/background.png' },
      { name: 'character', url: './assets/sheets/character.json' },
      { name: 'food', url: './assets/sheets/food.json' },
    ]);
    await AssetManager.load();

    this.game.start();
  }
}

export { App };
