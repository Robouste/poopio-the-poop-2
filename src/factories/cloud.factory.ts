import { Resources } from "@utils/resources";
import { ImageSource, Random, Scene, Timer, vec } from "excalibur";
import { Cloud } from "../actors/cloud.actor";

export class CloudFactory {
  private _timer: Timer;
  private _random = new Random();

  constructor(private _scene: Scene) {
    this._timer = new Timer({
      interval: 1500,
      repeats: true,
      action: () => this._spawn(),
      randomRange: [1000, 2000],
    });

    this._scene.add(this._timer);
  }

  public start(): void {
    this._timer.start();
  }

  public stop(): void {
    this._timer.stop();

    for (const actor of this._scene.actors) {
      if (actor instanceof Cloud) {
        actor.kill();
      }
    }
  }

  private _spawn(): void {
    const cloudType = this._random.integer(1, 4);

    let imageSource: ImageSource;

    switch (cloudType) {
      case 1:
        imageSource = Resources.Images.Cloud1;
        break;
      case 2:
        imageSource = Resources.Images.Cloud2;
        break;
      case 3:
        imageSource = Resources.Images.Cloud3;
        break;
      case 4:
        imageSource = Resources.Images.Cloud4;
        break;
      default:
        imageSource = Resources.Images.Cloud1;
    }

    const maxY = this._scene.engine.screen.drawHeight * 0.65;
    const posY = this._random.integer(50, maxY);

    const scaleMin = 1;
    const scaleMax = 3;

    // A value between 0.0 and 1.0
    const t = posY / maxY;

    // Linear interpolation: scale decreases as posY decreases
    const scale = scaleMax + (scaleMin - scaleMax) * t;

    // Adjust velocity so higher (larger) clouds move faster
    // This enhances the depth effect (parallax)
    const baseSpeed = this._random.integer(20, 40);
    const vel = vec(-baseSpeed * scale, 0);

    const cloud = new Cloud(
      imageSource,
      vec(this._scene.engine.screen.drawWidth, posY),
      vel,
      scale
    );

    this._scene.add(cloud);
  }
}
