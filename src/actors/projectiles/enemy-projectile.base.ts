import { Actor, ActorArgs, Engine, Vector } from "excalibur";

export interface EnemyProjectileArgs {
  actorArgs: ActorArgs;
  target: Vector;
  speed: number;
}

export abstract class EnemyProjectile extends Actor {
  private _target: Vector;
  private _speed: number;

  constructor(args: EnemyProjectileArgs) {
    super(args.actorArgs);
    this._target = args.target;
    this._speed = args.speed;
  }

  public override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    this.on("exitviewport", () => this.kill());
  }

  public override onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    const direction = this._target.sub(this.pos);
    const velocity = direction.normalize().scale(this._speed);
    this.vel = velocity;
  }
}
