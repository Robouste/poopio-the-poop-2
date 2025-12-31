import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Collider,
  CollisionContact,
  Engine,
  ImageSource,
  Side,
  vec,
} from "excalibur";
import { GameScene } from "../scenes/game.scene";
import { Enemy } from "./enemy.base";
import { HeroBullet } from "./projectiles/hero-bullet.actor";

export const obsticleTypes = ["Plunger", "ToiletPaper"] as const;
export type ObsticleType = (typeof obsticleTypes)[number];
export type ObsticleConfig = {
  image: ImageSource;
  width: number;
  height: number;
  collider?: Collider;
};

export class Obsticle extends Enemy {
  public isInvincible = true;
  public scoreValue = 10;

  private _baseY = 0;
  private _t = 0; // seconds

  // Oscillation parameters
  private _amplitude = 8; // pixels up/down
  private _frequency = 1.5; // oscillations per second (Hz)

  private _isStopped = false;

  constructor(private _config: ObsticleConfig, gameScene: GameScene) {
    const baseY = gameScene.engine.screen.drawHeight - Config.GroundHeight - 48;

    super(gameScene, {
      pos: vec(gameScene.engine.screen.drawWidth, baseY),
      width: _config.width,
      height: _config.height,
      vel: vec(-Config.BaseSpeed, 0),
      anchor: vec(0, 0.5),
    });

    this._baseY = baseY;
  }

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    const image = this._config.image.toSprite();
    image.destSize.height = this._config.height;
    image.destSize.width = this._config.width;

    if (this._config.collider) {
      this.anchor.setTo(0.5, 0.5);
      this.collider.set(this._config.collider);
    }

    this.graphics.use(image);
  }

  public override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed);

    if (this._isStopped) {
      return;
    }

    this._t += elapsed / 1000;

    // y = base + sin(2π f t) * amplitude
    this.pos.y =
      this._baseY +
      Math.sin(this._t * Math.PI * 2 * this._frequency) * this._amplitude;
  }

  public override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof HeroBullet) {
      Resources.Sounds.ImpactInvincible.play();
    }
  }

  public stop(): void {
    this._isStopped = true;
    this.vel.setTo(0, 0);
  }
}
