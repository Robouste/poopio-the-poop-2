import { Resources } from "@utils/resources";
import { CompositeCollider, Random, Shape, Timer, vec } from "excalibur";
import {
  Obsticle,
  ObsticleConfig,
  ObsticleType,
  obsticleTypes,
} from "../actors/obsticle.actor";
import { GameScene } from "../scenes/game.scene";
import { Factory } from "./factory.base";

const obsticleConfigs: Record<ObsticleType, ObsticleConfig> = {
  Plunger: {
    image: Resources.Images.Plunger,
    width: 43,
    height: 64,
  },
  ToiletPaper: {
    image: Resources.Images.ToiletPaper,
    width: 48,
    height: 38,
  },
};

export class ObsticleFactory extends Factory {
  private _timer: Timer;
  private _random: Random = new Random();

  constructor(private _scene: GameScene) {
    super();

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
    const obsticleIndex = this._random.integer(1, obsticleTypes.length) - 1;
    const obsticleType = obsticleTypes[obsticleIndex];
    const config = this._createObsticleConfig(obsticleType);

    const obsticle = new Obsticle(config, this._scene);

    this._scene.add(obsticle);
  }

  private _createObsticleConfig(type: ObsticleType): ObsticleConfig {
    const config = obsticleConfigs[type];

    if (type === "Plunger") {
      const base = Shape.Polygon(
        [
          vec(-24, 20), // Bottom left
          vec(24, 20), // Bottom right
          vec(0, -10), // Top center
        ],
        vec(0, 12)
      );

      const handle = Shape.Box(
        8,
        config.height * 0.66,
        vec(0.5, 0.5),
        vec(0, -10)
      );

      config.collider = new CompositeCollider([base, handle]);
    }

    return config;
  }
}
