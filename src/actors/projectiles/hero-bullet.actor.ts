import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Actor,
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
import { Enemy } from "../enemy.base";

export class HeroBullet extends Actor {
  private _impactInvincibleAnimation!: Animation;
  private _impactAnimation!: Animation;

  constructor(pos: Vector) {
    super({
      pos,
      acc: vec(Config.ProjectileSpeed, 0),
      width: 48,
      height: 16,
    });
  }

  public override onInitialize(_engine: Engine): void {
    this._initializeBullet();
    this._initializeImpactAnimation();

    this.on("exitviewport", () => this.kill());
  }

  public override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof Enemy) {
      const effect = new Actor({
        pos: this.pos,
        width: 48,
        height: 48,
      });

      const animation = other.owner.isInvincible
        ? this._impactInvincibleAnimation
        : this._impactAnimation;

      effect.graphics.use(animation);
      animation.events.on("end", () => effect.kill());
      this.scene?.add(effect);
      this.kill();
    }
  }

  private _initializeBullet(): void {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.HeroBullet,
      grid: {
        rows: 1,
        columns: 10,
        spriteWidth: 36,
        spriteHeight: 16,
      },
    });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 9),
      50,
      AnimationStrategy.Loop
    );

    this.graphics.add("bullet", animation);
    this.graphics.use("bullet");

    Resources.Sounds.Fire.play({
      volume: 0.5,
    });
  }

  private _initializeImpactAnimation(): void {
    const invincibleSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.ImpactInvincibleEffect,
      grid: {
        rows: 1,
        columns: 9,
        spriteWidth: 48,
        spriteHeight: 48,
      },
    });

    this._impactInvincibleAnimation = Animation.fromSpriteSheet(
      invincibleSpriteSheet,
      range(0, 8),
      50,
      AnimationStrategy.End
    );

    const impactSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.ImpactInvincibleEffect,
      grid: {
        rows: 1,
        columns: 14,
        spriteWidth: 48,
        spriteHeight: 48,
      },
    });

    this._impactAnimation = Animation.fromSpriteSheet(
      impactSpriteSheet,
      range(0, 13),
      50,
      AnimationStrategy.End
    );
  }
}
