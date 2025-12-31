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
import { EnemyProjectile } from "./enemy-projectile.base";

export interface FireOrbArgs {
  pos: Vector;
  yTarget: number;
}

export class FireOrb extends EnemyProjectile {
  constructor(args: FireOrbArgs) {
    const projectileWidth = 64;

    super({
      actorArgs: {
        pos: args.pos,
        width: projectileWidth,
        height: 48,
      },
      target: vec(-projectileWidth, args.yTarget),
      speed: Config.FireOrbSpeed,
    });
  }

  public onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    this._initializeAnimation();

    this.on("exitviewport", () => this.kill());
  }

  private _initializeAnimation(): void {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.FireOrb,
      grid: {
        rows: 1,
        columns: 8,
        spriteHeight: 48,
        spriteWidth: 64,
      },
    });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 7),
      50,
      AnimationStrategy.Loop
    );

    animation.flipHorizontal = true;

    this.graphics.add("fire-orb-animation", animation);
    this.graphics.use("fire-orb-animation");

    Resources.Sounds.FireOrb.play({
      volume: 0.5,
    });
  }
}
