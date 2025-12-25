import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Actor,
  Animation,
  AnimationStrategy,
  Engine,
  range,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";

export class HeroBullet extends Actor {
  constructor(pos: Vector) {
    super({
      pos,
      acc: vec(Config.ProjectileSpeed, 0),
      width: 36,
      height: 16,
    });
  }

  public override onInitialize(engine: Engine): void {
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

    Resources.Sounds.Fire.play();
  }
}
