import { Engine, vec } from "excalibur";
import { Enemy } from "./enemy.base";
import { HealthBar } from "./health-bar.actor";

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

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    this.healthBar = new HealthBar(this.width, vec(0, 40), this.healthPoint);
    this.addChild(this.healthBar);
  }
}
