import { Resources } from "@utils/resources";
import { Actor, Engine, Sprite, vec, Vector } from "excalibur";

export class HealthBar extends Actor {
  private _fillActor!: Actor;
  private _fillSprite!: Sprite;
  private _borderSize = 4;
  private _maxWidth: number;

  constructor(width: number, pos: Vector, private _maxHealth: number) {
    super({
      pos,
      width,
      height: 8,
    });

    this._maxWidth = width - this._borderSize; // Sprite border
  }

  public onInitialize(engine: Engine): void {
    const healthBarBorder = Resources.Images.HealthBarBorder.toSprite();
    healthBarBorder.destSize.width = this.width;
    healthBarBorder.destSize.height = this.height;

    this.graphics.use(healthBarBorder);
    this._fillSprite = Resources.Images.HealthBar.toSprite();
    this._fillSprite.destSize.width = this._maxWidth; // initial full width minus border
    this._fillSprite.destSize.height = this.height - this._borderSize;

    this._fillActor = new Actor({
      pos: vec(-(this.width / 2) + 2, -this.height / 2 + this._borderSize / 2),
      anchor: Vector.Zero,
    });

    this._fillActor.graphics.use(this._fillSprite);
    this.addChild(this._fillActor);
  }

  public updateHealth(currentHealth: number): void {
    const healthPercentage = Math.max(0, currentHealth / this._maxHealth);

    this._fillSprite.destSize.width = this._maxWidth * healthPercentage;
  }
}
