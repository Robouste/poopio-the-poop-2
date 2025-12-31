import { Actor, Color, Engine, vec } from "excalibur";

export class Background extends Actor {
  private _overlay: Actor;

  constructor(engine: Engine) {
    const gameWidth = engine.drawWidth;
    const gameHeight = engine.drawHeight;

    super({
      pos: vec(gameWidth / 2, gameHeight / 2),
      width: gameWidth,
      height: gameHeight,
      z: -1000,
      color: Color.ExcaliburBlue,
    });

    this._overlay = new Actor({
      width: gameWidth,
      height: gameHeight,
      color: Color.Black,
      opacity: 0,
      z: 1,
    });

    this.addChild(this._overlay);
  }

  public fadeToDark(duration = 1000): void {
    this._overlay.actions.fade(0.7, duration);
  }

  public restore(duration = 1000): void {
    this._overlay.actions.fade(0, duration);
  }
}
