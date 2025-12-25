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
  Side,
  Sprite,
  SpriteSheet,
  vec,
} from "excalibur";
import { Resources } from "../utils/resources";
import { Ground } from "./ground.actor";
import { HeroBullet } from "./hero-bullet.actor";

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

  constructor(engine: Engine) {
    super({
      name: "Hero",
      pos: vec(50, engine.screen.drawHeight - Config.GroundHeight - 84),
      width: 32,
      height: 84,
      z: 2,
      // anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
    });
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
      100,
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

    this._initControls(engine);
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (!this._isPlaying) {
      return;
    }
  }

  override onPreCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof Ground) {
      this._noOfJumps = 2;
      this.graphics.use(HeroAnimation.Run);
    }
  }

  override onCollisionEnd(
    self: Collider,
    other: Collider,
    side: Side,
    lastContact: CollisionContact
  ): void {
    // Called when a pair of objects separates
  }

  public start(): void {
    this._isPlaying = true;
    this._noOfJumps = 2;
  }

  public stop(): void {
    this._isPlaying = false;
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
    this.vel.y = -400;
    this.graphics.use(HeroAnimation.Jump);
  }

  private _fire(engine: Engine): void {
    const bullet = new HeroBullet(vec(this.pos.x, this.pos.y));
    engine.add(bullet);
  }
}
