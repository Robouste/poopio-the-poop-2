import { Actor, Color, Scene, vec } from "excalibur";

export class LightningFlash extends Actor {
  constructor(private _scene: Scene) {
    const gameWidth = _scene.engine.drawWidth;
    const gameHeight = _scene.engine.drawHeight;

    super({
      pos: vec(gameWidth / 2, gameHeight / 2),
      width: gameWidth,
      height: gameHeight,
      color: Color.White,
      opacity: 0,
      z: 9999,
    });
  }

  public strike(): void {
    this.graphics.opacity = 1;

    this.actions.clearActions();
    this.actions.fade(0, 200);
    this._scene.camera.shake(5, 5, 500);
  }
}
