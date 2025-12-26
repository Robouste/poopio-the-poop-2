import { Resources } from "@utils/resources";
import { Random, Timer } from "excalibur";
import { Obsticle } from "../actors/obsticle.actor";
import { GameScene } from "../scenes/game.scene";

export class ObsticleFactory {
  private _timer: Timer;
  private _random: Random = new Random();

  constructor(private _scene: GameScene) {
    this._timer = new Timer({
      interval: 1000,
      repeats: true,
      action: () => this._spawn(),
      randomRange: [400, 1500],
    });

    this._scene.add(this._timer);
  }

  public start(): void {
    this._timer.start();
  }

  public stop(): void {
    this._timer.stop();

    for (const actor of this._scene.actors) {
      if (actor instanceof Obsticle) {
        actor.kill();
      }
    }
  }

  private _spawn(): void {
    const obsticleType = this._random.integer(1, 2);

    const imageSource =
      obsticleType === 1
        ? Resources.Images.Obsticle1
        : Resources.Images.Obsticle2;
    const obsticle = new Obsticle(imageSource, this._scene);

    this._scene.add(obsticle);
  }
}
