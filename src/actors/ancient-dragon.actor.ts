import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Animation,
  AnimationStrategy,
  Engine,
  range,
  SpriteSheet,
  Timer,
  vec,
  Vector,
} from "excalibur";
import { GameScene } from "../scenes/game.scene";
import { Hero } from "./hero.actor";
import { KillableEnemy } from "./killable-enemy.base";
import { FireOrb } from "./projectiles/fire-orb.actor";
import { Shockwave } from "./projectiles/shockwave.actor";

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

  private _fireOrbTimer: Timer;
  private _shockwaveTimer: Timer;

  private _hero!: Hero;

  constructor(pos: Vector, gameScene: GameScene) {
    super(gameScene, {
      pos,
      height: 128,
      width: 192,
    });

    this._fireOrbTimer = new Timer({
      interval: 0,
      repeats: true,
      action: () => this._castFireOrb(gameScene),
      randomRange: [4000, 6000],
    });

    this._shockwaveTimer = new Timer({
      interval: 0,
      repeats: true,
      action: () => this._castShockwave(gameScene),
      randomRange: [7000, 9000],
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

    this.scene?.add(this._fireOrbTimer);
    this.scene?.add(this._shockwaveTimer);

    this._fireOrbTimer.start();
    this._shockwaveTimer.start();

    this.on("kill", () => {
      this._shockwaveTimer.cancel();
      this._fireOrbTimer.cancel();
      this.scene?.remove(this._shockwaveTimer);
      this.scene?.remove(this._fireOrbTimer);
    });
  }

  private _castFireOrb(gameScene: GameScene): void {
    const orb = new FireOrb({
      pos: this.pos.clone(),
      yTarget: this._hero.pos.y,
    });

    gameScene.add(orb);
  }

  private _castShockwave(gameScene: GameScene): void {
    const y = gameScene.engine.screen.drawHeight - Config.GroundHeight;

    const shockwave = new Shockwave(vec(this.pos.x, y), y);

    gameScene.add(shockwave);
  }
}
