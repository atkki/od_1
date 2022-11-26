import { Application, Sprite, Text, Texture } from 'pixi.js';
import { Input } from './Input';
import { AssetManager } from './AssetManager';
import { Character } from './entities/Character';
import { Item, IDropZone } from './entities/Item';

interface IGameConfig {
  health: number;
  dropZone: IDropZone;
}

class Game {
  private readonly app: Application;
  private readonly character: Character;
  private readonly config: IGameConfig = {
    health: 10,
    dropZone: { speed: 1.3, offsetX: 0.45, offsetY: 1.5 },
  };

  private health = this.config.health;
  private points = 0;

  private items: Item[] = [];
  private pointsText?: Text;
  private healthBar: Sprite[] = [];

  constructor(app: Application) {
    this.app = app;
    this.character = new Character(this.app);
  }

  public start(): void {
    this.setupEnvironment();
    this.setupCharacter();
    this.setupItems();
    this.setupInput();
    this.setupHUD();

    this.app.ticker.add((delta: number) => this.tick(delta));
  }

  private reset(): void {
    this.health = this.config.health;
    this.points = 0;

    for (const item of this.items) {
      item.drop();
    }

    this.updateHUD();
  }

  // game loop
  private tick(delta: number): void {
    this.character.tick(delta);
    for (const item of this.items) {
      if (item.sprite) {
        item.tick(delta);

        if (item.intersect(this.character)) {
          this.score(true);
          item.drop(); // reset position
        } else if (item.failed) {
          this.score(false);
          item.drop();
        }
      }
    }
  }

  private score(success: boolean): void {
    if (success) {
      this.points++;
    } else {
      this.health--;
    }

    this.updateHUD();
    if (this.health <= 0) {
      if (confirm(`Wynik: ${this.points}\nCzy chcesz zacząć ponownie?`)) {
        this.reset();
      } else {
        alert('Nie masz wyboru, musisz grać dalej 🙃');
        this.reset();
      }
    }
  }

  private setupCharacter(): void {
    this.character.load();
  }

  private setupEnvironment(): void {
    const background: Sprite = new Sprite(AssetManager.getResource('background').texture);
    this.app.stage.addChild(background);
  }

  private setupItems(): void {
    for (let i = 0; i < 20; i++) {
      const item: Item = new Item(this.app, this.config.dropZone);
      item.load();
      item.drop();

      this.items.push(item);
    }
  }

  private setupInput(): void {
    new Input('ArrowLeft').down = () => {
      this.character.state.left = true;
      this.character.state.right = false;
    };
    new Input('ArrowLeft').up = () => (this.character.state.left = false);
    new Input('ArrowRight').down = () => {
      this.character.state.left = false;
      this.character.state.right = true;
    };
    new Input('ArrowRight').up = () => (this.character.state.right = false);
    new Input('ArrowUp').down = () => {
      if (!this.character.sprite) return;
      if (this.character.sprite.position.y <= this.character.defaultHeight) {
        this.character.state.jump = true;
      }
    };
  }

  private setupHUD(): void {
    this.pointsText = new Text('Punkty: 0', {
      fontFamily: 'Verdana',
      fontSize: 35,
      fill: 'white',
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    this.pointsText.position.x = 5;
    this.pointsText.position.y = 5;
    this.app.stage.addChild(this.pointsText);

    const offset = 5;
    const width = 20;
    const height = 10;
    let x = this.app.stage.width - this.config.health * (width + offset);
    const y = 20;
    for (let i = 0; i < this.config.health; i++) {
      const rectangle: Sprite = Sprite.from(Texture.WHITE);
      rectangle.position.x = x;
      rectangle.position.y = y;
      rectangle.width = width;
      rectangle.height = height;
      rectangle.tint = 0xff0000;
      this.app.stage.addChild(rectangle);
      this.healthBar.push(rectangle);

      x += width + offset;
    }
  }

  private updateHUD(): void {
    if (this.pointsText) {
      this.pointsText.text = `Punkty: ${this.points}`;
      this.pointsText.updateText(true);
    }

    for (let i = 0; i < this.config.health; i++) {
      this.healthBar[i].tint = this.health > i ? 0xff0000 : 0x808080;
    }
  }
}

export { Game };
