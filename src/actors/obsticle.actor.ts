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
import { Ennemy } from "./ennemy.base";
import { HeroBullet } from "./hero-bullet.actor";

export class Obsticle extends Ennemy {
  public isInvincible = true;

  private _baseY = 0;
  private _t = 0; // seconds

  // tweak these
  private _amplitude = 8; // pixels up/down
  private _frequency = 1.5; // oscillations per second (Hz)

  constructor(private _image: ImageSource, engine: Engine) {
    const baseY =
      engine.screen.drawHeight - Config.GroundHeight - Config.ObsticleHeight;

    super({
      pos: vec(engine.screen.drawWidth, baseY),
      width: Config.ObsticleWidth,
      height: Config.ObsticleHeight,
      vel: vec(-Config.BaseSpeed, 0),
    });

    this._baseY = baseY;
  }

  public override onInitialize(): void {
    const image = this._image.toSprite();
    image.destSize.height = Config.ObsticleHeight;
    image.destSize.width = Config.ObsticleWidth;

    this.graphics.use(image);

    this.on("exitviewport", () => this.kill());
  }

  public override onPreUpdate(engine: Engine, elapsed: number): void {
    super.onPreUpdate(engine, elapsed);

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
}
