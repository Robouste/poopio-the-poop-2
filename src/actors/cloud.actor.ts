import { Actor, Engine, ImageSource, vec, Vector } from "excalibur";

export class Cloud extends Actor {
  constructor(
    private _image: ImageSource,
    pos: Vector,
    vel: Vector,
    scale: number = 1
  ) {
    super({
      pos,
      vel,
      scale: vec(scale, scale),
      anchor: vec(0, 0),
      name: scale.toString(),
    });
  }

  public override onInitialize(engine: Engine): void {
    const image = this._image.toSprite();
    this.graphics.use(image);

    this.on("exitviewport", () => this.kill());
  }

  public stop(): void {
    this.vel = vec(0, 0);
  }
}
