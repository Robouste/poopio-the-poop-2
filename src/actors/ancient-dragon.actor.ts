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
import { KillableEnemy } from "./killable-enemy.base";

enum AncientDragonAnimation {
  Fly = "ancient-dragon-fly",
  Hit = "ancient-dragon-hit",
}

export class AncientDragon extends KillableEnemy {
  public isInvincible = false;
  public scoreValue = 500;

  protected healthPoint = 50;
  protected flyAnimationName = AncientDragonAnimation.Fly;
  protected hitAnimationName = AncientDragonAnimation.Hit;

  constructor(pos: Vector, gameScene: GameScene) {
    super(gameScene, {
      pos,
      height: 128,
      width: 192,
    });
  }

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.AncientDragon,
      grid: {
        rows: 2,
        columns: 4,
        spriteWidth: 185,
        spriteHeight: 134,
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

    this.graphics.add(AncientDragonAnimation.Fly, this.flyAnimation);
    this.graphics.add(AncientDragonAnimation.Hit, this.hitAnimation);

    this.graphics.use(AncientDragonAnimation.Fly);

    this.actions.moveTo({
      pos: vec(engine.screen.drawWidth - 10 - this.width / 2, this.pos.y),
      duration: 2000,
    });
  }
}
