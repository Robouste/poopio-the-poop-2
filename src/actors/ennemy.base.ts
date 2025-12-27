import { Actor, ActorArgs, Color, Font, Label, vec } from "excalibur";
import { GameScene } from "../scenes/game.scene";

export abstract class Ennemy extends Actor {
  public abstract isInvincible: boolean;
  public abstract scoreValue: number;

  private _scoreAddedLabel!: Label;

  constructor(
    protected gameScene: GameScene,
    actorArgs: ActorArgs | undefined
  ) {
    super(actorArgs);

    this.on("defeated", () => {
      this.gameScene.incrementScore(this.scoreValue);
      this._showScoreAdded();
      this.kill();
    });

    this.on("exitviewport", () => this.emit("defeated"));
  }

  private _showScoreAdded(): void {
    this._scoreAddedLabel = new Label({
      text: `+${this.scoreValue}`,
      pos: vec(this.pos.x + 30, this.pos.y),
      z: 1000,
      anchor: vec(0.5, 0.5),
      font: new Font({
        size: 20,
        color: Color.Yellow,
      }),
    });
    this.gameScene.add(this._scoreAddedLabel);

    // Animate the label to rise up and fade out
    this._scoreAddedLabel.actions
      .moveBy(0, -30, 1000)
      .fade(0, 1000)
      .callMethod(() => {
        this._scoreAddedLabel.kill();
      });
  }
}
