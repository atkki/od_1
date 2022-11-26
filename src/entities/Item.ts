import { Application, Sprite, Spritesheet } from 'pixi.js';
import Entity from './Entity';
import { AssetManager } from '../AssetManager';

interface IDropZone {
  speed: number;
  offsetX: number;
  offsetY: number;
}

class Item extends Entity {
  public sprite: Sprite | undefined;
  public failed = false;

  private sheet: Spritesheet | undefined;

  private readonly config: IDropZone;
  private readonly maxInSheet = 63;
  private readonly rotationSpeed = 0.18;

  constructor(app: Application, config: IDropZone) {
    super(app);
    this.config = config;
  }

  public load(): void {
    this.sheet = AssetManager.getResource('food')?.spritesheet;
    if (this.sheet) {
      const path = `Food-${Math.floor(Math.random() * this.maxInSheet)}.png`;
      this.sprite = new Sprite(this.sheet.textures[path]);
      this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2); // fix rotation
      this.app.stage.addChild(this.sprite);
    }
  }

  public tick(delta: number): void {
    if (this.sprite) {
      this.sprite.rotation += this.rotationSpeed * delta;

      const height = this.config.speed * delta;
      if (this.sprite.position.y + height >= this.app.renderer.height) {
        this.failed = true;
      } else {
        this.sprite.position.y += height;
      }
    }
  }

  public drop(): void {
    if (!this.sprite) return;
    const { width, height } = this.app.stage;
    const randomRange = (): number => 1 - Math.random() * 2; // -1 - 1 range

    this.failed = false;
    this.sprite.position.x = width / 2 - randomRange() * (width * this.config.offsetX);
    this.sprite.position.y = -(Math.random() * ((height / 2) * this.config.offsetY));
  }
}

export { Item, IDropZone };
