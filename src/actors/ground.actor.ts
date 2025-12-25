import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import { Actor, CollisionType, Color, Engine, vec } from "excalibur";

export class Ground extends Actor {
  private _isMoving = false;
  private _sprite = Resources.Images.Ground.toSprite();

  constructor(engine: Engine) {
    super({
      pos: vec(0, engine.screen.drawHeight - Config.GroundHeight),
      anchor: vec(0, 0),
      height: Config.GroundHeight,
      width: engine.screen.drawWidth,
      z: 1,
      color: Color.fromHex("#bd9853"),
      collisionType: CollisionType.Fixed,
    });
  }

  public override onInitialize(engine: Engine): void {
    this._sprite.sourceView.width = engine.screen.drawWidth;
    this._sprite.destSize.width = engine.screen.drawWidth;
    this._sprite.sourceView.height = Config.GroundHeight;
    this._sprite.destSize.height = Config.GroundHeight;

    this.graphics.use(this._sprite);
  }

  public override onPostUpdate(engine: Engine, elapsedMs: number): void {
    if (!this._isMoving) {
      return;
    }

    this._sprite.sourceView.x += Config.BaseSpeed * (elapsedMs / 1000);
    this._sprite.sourceView.x =
      this._sprite.sourceView.x % engine.screen.drawWidth;
  }

  public start(): void {
    this._isMoving = true;
  }

  public stop(): void {
    this._isMoving = false;
  }
}
