import { Config } from "@utils/config";
import { Actor, Engine, ImageSource, vec } from "excalibur";

const _obsticleWidth = 48;
const _obsticleHeight = 48;

export class Obsticle extends Actor {
  constructor(private _image: ImageSource, engine: Engine) {
    super({
      pos: vec(
        engine.screen.drawWidth,
        engine.screen.drawHeight - Config.GroundHeight - _obsticleHeight
      ),
      width: _obsticleWidth,
      height: _obsticleHeight,
      vel: vec(-Config.BaseSpeed, 0),
    });
  }

  public override onInitialize(): void {
    const image = this._image.toSprite();
    image.destSize.height = _obsticleHeight;
    image.destSize.width = _obsticleWidth;

    this.graphics.use(image);

    this.on("exitviewport", () => this.kill());
  }
}
