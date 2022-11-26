import { Application, Sprite } from 'pixi.js';
import hitTestRectangle from '../utils/hitTestRectangle';

abstract class Entity {
  public abstract sprite?: Sprite;
  public abstract load(): void;
  public abstract tick(delta: number): void;

  public app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public intersect(other: Entity): boolean {
    if (!this.sprite || !other.sprite) return false;
    return hitTestRectangle(this.sprite, other.sprite);
  }
}

export default Entity;
