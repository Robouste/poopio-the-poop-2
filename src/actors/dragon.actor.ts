import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Animation,
  AnimationStrategy,
  Collider,
  CollisionContact,
  Engine,
  range,
  Side,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";
import { GameScene } from "../scenes/game.scene";
import { HeroBullet } from "./hero-bullet.actor";
import { Hero } from "./hero.actor";
import { KillableEnemy } from "./killable-enemy.base";

enum DragonAnimation {
  Fly = "fly",
  Hit = "hit",
}

export class Dragon extends KillableEnemy {
  public isInvincible = false;
  public scoreValue = 50;

  private _flyAnimation!: Animation;
  private _hitAnimation!: Animation;
  private _hero!: Hero;
  protected healthPoint = 3;

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

    this._flyAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 3),
      100,
      AnimationStrategy.Loop
    );

    this._hitAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(4, 5),
      100,
      AnimationStrategy.Loop
    );

    this.graphics.add(DragonAnimation.Fly, this._flyAnimation);
    this.graphics.add(DragonAnimation.Hit, this._hitAnimation);

    this.graphics.use(DragonAnimation.Fly);
  }

  public override onPostUpdate(engine: Engine, elapsed: number): void {
    const heroPos = this._hero.pos;

    const direction = heroPos.sub(this.pos);
    const velocity = direction.normalize().scale(Config.BaseSpeed);
    this.vel = velocity;
  }

  public override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof HeroBullet) {
      this.graphics.use(DragonAnimation.Hit);
      Resources.Sounds.Impact.play({
        volume: 0.5,
      });
      this.hp -= 1;
      this.actions
        .delay(500)
        .callMethod(() => this.graphics.use(DragonAnimation.Fly));
    }
  }
}
