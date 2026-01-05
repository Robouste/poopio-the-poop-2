import { Config } from "@utils/config";
import {
  Actor,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionContact,
  CollisionType,
  Engine,
  KeyEvent,
  Keys,
  PointerButton,
  PointerEvent,
  PointerType,
  range,
  Shape,
  Side,
  Sprite,
  SpriteSheet,
  vec,
  Vector,
} from "excalibur";
import { GameScene } from "../scenes/game.scene";
import { Resources } from "../utils/resources";
import { Enemy } from "./enemy.base";
import { Ground } from "./ground.actor";
import { EnemyProjectile } from "./projectiles/enemy-projectile.base";
import { HeroBullet } from "./projectiles/hero-bullet.actor";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

enum HeroAnimation {
  Start = "start",
  Run = "run",
  Jump = "jump",
}

export class Hero extends Actor {
  private _jumpAnimation!: Animation;
  private _runAnimation!: Animation;
  private _startSprite!: Sprite;
  private _noOfJumps = 2;
  private _isPlaying = false;
  private _startingPos: Vector;

  constructor(engine: Engine, private _gameScene: GameScene) {
    const startingPos = vec(
      50,
      engine.screen.drawHeight - Config.GroundHeight - 84
    );

    super({
      name: "Hero",
      pos: startingPos,
      width: 32,
      height: 84,
      z: 2,
      collisionType: CollisionType.Active,
    });

    this._startingPos = startingPos;
  }

  override onInitialize(engine: Engine) {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Images.Hero,
      grid: {
        rows: 1,
        columns: 28,
        spriteWidth: 32,
        spriteHeight: 84,
      },
    });

    this._runAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 17),
      50,
      AnimationStrategy.Loop
    );

    this._jumpAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(21, 23),
      150,
      AnimationStrategy.Freeze
    );

    this._startSprite = spriteSheet.getSprite(0, 0);

    this.graphics.add(HeroAnimation.Start, this._startSprite);
    this.graphics.add(HeroAnimation.Run, this._runAnimation);
    this.graphics.add(HeroAnimation.Jump, this._jumpAnimation);

    this.graphics.use(HeroAnimation.Start);

    this.collider.set(Shape.Box(28, 78, Vector.Half));

    this._initControls(engine);
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (!this._isPlaying) {
      return;
    }
  }

  override onCollisionStart(
    _self: Collider,
    other: Collider,
    _side: Side,
    _contact: CollisionContact
  ): void {
    if (other.owner instanceof Ground) {
      this._noOfJumps = 2;
      this.graphics.use(HeroAnimation.Run);
    }

    if (
      other.owner instanceof Enemy ||
      other.owner instanceof EnemyProjectile
    ) {
      this._gameScene.gameOver();
    }
  }

  public start(): void {
    this._isPlaying = true;
    this._noOfJumps = 2;
    this.graphics.use(HeroAnimation.Run);
    this.pos.setTo(this._startingPos.x, this._startingPos.y);
    this.body.useGravity = true;
  }

  public stop(): void {
    this._isPlaying = false;
    this.body.useGravity = false;
    this.vel.setTo(0, 0);
    this.graphics.use(HeroAnimation.Start);
  }

  private _initControls(engine: Engine): void {
    engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.Space) {
        this._jump();
      }

      if (evt.key === Keys.Enter) {
        this._fire(engine);
      }
    });

    engine.input.pointers.on("down", (evt: PointerEvent) => {
      if (evt.pointerType === PointerType.Touch) {
        if (evt.worldPos.x < engine.screen.drawWidth / 2) {
          this._jump();
        } else {
          this._fire(engine);
        }
      } else {
        if (evt.button === PointerButton.Left) {
          this._jump();
        }

        if (evt.button === PointerButton.Right) {
          this._fire(engine);
        }
      }
    });
  }

  private _jump(): void {
    if (this._noOfJumps === 0) {
      return;
    }

    if (this._noOfJumps === 2) {
      Resources.Sounds.Jump.play();
    }

    if (this._noOfJumps === 1) {
      Resources.Sounds.DoubleJump.play();
    }

    this._noOfJumps--;
    this.vel.y = Config.HeroJumpVelocity;
    this.graphics.use(HeroAnimation.Jump);
  }

  private _fire(engine: Engine): void {
    const bullet = new HeroBullet(vec(this.pos.x, this.pos.y));
    engine.add(bullet);
  }
}
