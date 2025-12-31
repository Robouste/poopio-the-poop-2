import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Animation,
  AnimationStrategy,
  Engine,
  Shape,
  SpriteSheet,
  Vector,
  range,
  vec,
} from "excalibur";
import { EnemyProjectile } from "./enemy-projectile.base";

export class Shockwave extends EnemyProjectile {
  constructor(pos: Vector, yTarget: number) {
    const projectileWidth = 128;

    super({
      actorArgs: { pos, width: projectileWidth, height: 64, anchor: vec(0, 1) },
      speed: Config.ShockwaveSpeed,
      target: vec(-projectileWidth, yTarget),
    });
  }

  public onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    this._initializeAnimation();
    this._setCollider();
  }

  private _initializeAnimation(): void {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.Shockwave,
      grid: {
        rows: 1,
        columns: 5,
        spriteHeight: 64,
        spriteWidth: 128,
      },
    });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 7),
      50,
      AnimationStrategy.Loop
    );

    animation.flipHorizontal = true;

    this.graphics.add("shockwave-animation", animation);
    this.graphics.use("shockwave-animation");

    Resources.Sounds.Shockwave.play({
      volume: 0.5,
    });
  }

  private _setCollider(): void {
    this.collider.set(
      Shape.Polygon([
        vec(0, 0),
        vec(this.width * 0.2, -this.height),
        vec(this.width, 0),
      ])
    );
  }
}
