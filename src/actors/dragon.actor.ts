import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Animation,
  AnimationStrategy,
  Engine,
  range,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";
import { GameScene } from "../scenes/game.scene";
import { Hero } from "./hero.actor";
import { KillableEnemy } from "./killable-enemy.base";

enum DragonAnimation {
  Fly = "dragon-fly",
  Hit = "dragon-hit",
}

export class Dragon extends KillableEnemy {
  public isInvincible = false;
  public scoreValue = 50;

  protected healthPoint = 3;
  protected flyAnimationName = DragonAnimation.Fly;
  protected hitAnimationName = DragonAnimation.Hit;

  private _hero!: Hero;
  private _isStopped = false;

  constructor(pos: Vector, gameScene: GameScene) {
    super(gameScene, {
      pos,
      height: 56,
      width: 80,
      vel: vec(-Config.BaseSpeed, 0),
    });
  }

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    const hero = this.scene?.actors.find((actor) => actor instanceof Hero);

    if (!hero) {
      throw new Error("Hero not found in scene for Dragon actor");
    }

    this._hero = hero;

    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.Dragon,
      grid: {
        rows: 2,
        columns: 4,
        spriteHeight: 56,
        spriteWidth: 80,
      },
    });

    this.flyAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 3),
      100,
      AnimationStrategy.Loop
    );

    this.hitAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(4, 5),
      100,
      AnimationStrategy.Loop
    );

    this.graphics.add(DragonAnimation.Fly, this.flyAnimation);
    this.graphics.add(DragonAnimation.Hit, this.hitAnimation);

    this.graphics.use(DragonAnimation.Fly);
  }

  public override onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    if (this._isStopped) {
      return;
    }

    const heroPos = this._hero.pos;

    const direction = heroPos.sub(this.pos);
    const velocity = direction.normalize().scale(Config.BaseSpeed);
    this.vel = velocity;
  }

  public stop(): void {
    this._isStopped = true;
    this.vel.setTo(0, 0);
  }
}
