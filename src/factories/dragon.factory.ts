import { Config } from "@utils/config";
import { Random, Timer, vec } from "excalibur";
import { Dragon } from "../actors/dragon.actor";
import { GameScene } from "../scenes/game.scene";

export class DragonFactory {
  private _timer: Timer;
  private _random = new Random();

  constructor(private _scene: GameScene) {
    this._timer = new Timer({
      interval: 4000,
      repeats: true,
      action: () => this._spawn(),
      randomRange: [3000, 7000],
    });

    this._scene.add(this._timer);
  }

  public start(): void {
    this._timer.start();
  }

  public stop(): void {
    this._timer.stop();

    for (const actor of this._scene.actors) {
      if (actor instanceof Dragon) {
        actor.kill();
      }
    }
  }

  private _spawn(): void {
    const minY =
      this._scene.engine.drawHeight -
      Config.GroundHeight -
      Config.ObsticleHeight -
      100;
    const maxY = minY - 250;

    const dragon = new Dragon(
      vec(this._scene.engine.drawWidth, this._random.integer(maxY, minY)),
      this._scene
    );

    this._scene.add(dragon);
  }
}
