import { KillableEnemy } from "./killable-enemy.base";

export class AncientDragon extends KillableEnemy {
  public isInvincible = false;
  public scoreValue = 500;

  protected healthPoint = 80;
}
