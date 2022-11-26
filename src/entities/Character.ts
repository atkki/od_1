import { Application, AnimatedSprite, Spritesheet } from 'pixi.js';

import { AssetManager } from '../AssetManager';
import Entity from './Entity';

interface ICharacterState {
  left: boolean;
  right: boolean;
  jump: boolean;
  fall: boolean;
}

interface ICharacterConfig {
  resource: string;
  animation: CharacterAnimation;
  readonly movementSpeed: number;
  readonly jumpSpeed: number;
  readonly jumpMaxHeight: number;
  readonly fallSpeed: number;
}

enum CharacterAnimation {
  Idle = 'knight iso char_idle',
  Left = 'knight iso char_run left',
  Right = 'knight iso char_run right',
}

class Character extends Entity {
  public sprite: AnimatedSprite | undefined;
  public state: ICharacterState = { left: false, right: false, jump: false, fall: false };
  public defaultHeight = 0;

  private readonly config: ICharacterConfig = {
    resource: 'character',
    animation: CharacterAnimation.Idle,
    movementSpeed: 7,
    jumpSpeed: 6,
    jumpMaxHeight: 0.15,
    fallSpeed: 4,
  };

  private sheet: Spritesheet | undefined;

  constructor(app: Application) {
    super(app);
  }

  public load(): void {
    this.sheet = AssetManager.getResource(this.config.resource)?.spritesheet;
    if (this.sheet) {
      this.sprite = new AnimatedSprite(this.sheet.animations[this.config.animation]);
      this.sprite.loop = true;
      this.sprite.animationSpeed = 0.2;
      this.sprite.play();
      this.app.stage.addChild(this.sprite);

      this.defaultHeight = this.app.stage.height - this.sprite.height;
      this.sprite.position.x = this.app.stage.width / 2 - this.sprite.width / 2;
      this.sprite.position.y = this.defaultHeight;
    }
  }

  public tick(delta: number): void {
    if (!this.sheet || !this.sprite) return;
    if (this.state.left) {
      this.sprite.position.x = Math.max(0, this.sprite.position.x - this.config.movementSpeed * delta);
      this.switchAnimation(CharacterAnimation.Left);
    } else if (this.state.right) {
      this.sprite.position.x = Math.min(
        this.app.stage.width - this.sprite.width,
        this.sprite.position.x + this.config.movementSpeed * delta,
      );
      this.switchAnimation(CharacterAnimation.Right);
    } else {
      this.switchAnimation(CharacterAnimation.Idle);
    }

    if (this.state.fall) {
      this.sprite.position.y += this.config.fallSpeed * delta;
      if (this.sprite.position.y >= this.defaultHeight) {
        this.state.fall = false;
        this.state.jump = false;
        this.sprite.position.y = this.defaultHeight;
      }
    } else if (this.state.jump) {
      this.sprite.position.y -= this.config.jumpSpeed * delta;
      if (this.sprite.position.y < this.defaultHeight * (1 - this.config.jumpMaxHeight)) this.state.fall = true;
    }
  }

  private switchAnimation(animation: CharacterAnimation): void {
    if (!this.sheet || !this.sprite) return;

    if (this.config.animation !== animation) {
      this.config.animation = animation;
      this.sprite.textures = this.sheet.animations[animation];
      this.sprite.play();
    }
  }
}

export { Character };
