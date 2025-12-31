import { Resources } from "@utils/resources";
import {
  Animation,
  Collider,
  CollisionContact,
  Engine,
  Side,
  vec,
} from "excalibur";
import { Enemy } from "./enemy.base";
import { HealthBar } from "./health-bar.actor";
import { HeroBullet } from "./projectiles/hero-bullet.actor";

export abstract class KillableEnemy extends Enemy {
  public get hp(): number {
    return this.healthPoint;
  }
  public set hp(value: number) {
    this.healthPoint = value;
    this.healthBar.updateHealth(this.healthPoint);

    if (this.healthPoint <= 0) {
      this.emit("defeated");
    }
  }
  protected abstract healthPoint: number;
  protected healthBar!: HealthBar;

  protected flyAnimation!: Animation;
  protected hitAnimation!: Animation;

  protected abstract flyAnimationName: string;
  protected abstract hitAnimationName: string;

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    this.healthBar = new HealthBar(
      this.width,
      vec(0, this.height / 2 + 10),
      this.healthPoint
    );
    this.addChild(this.healthBar);
  }

  public override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof HeroBullet) {
      this.graphics.use(this.hitAnimationName);
      Resources.Sounds.Impact.play({
        volume: 0.5,
      });
      this.hp -= 1;
      this.actions
        .delay(500)
        .callMethod(() => this.graphics.use(this.flyAnimationName));
    }
  }
}
