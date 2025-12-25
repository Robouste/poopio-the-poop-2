import { Engine, Scene } from "excalibur";

export class MainMenuScene extends Scene {
  private _startButton: HTMLButtonElement;
  private _menuDiv: HTMLDivElement;

  constructor() {
    super();

    const startButton =
      document.querySelector<HTMLButtonElement>("#start-button");

    const menuDiv = document.querySelector<HTMLDivElement>("#main-menu");

    if (!startButton || !menuDiv) {
      throw new Error("Missing DOM elements for main menu");
    }

    this._startButton = startButton;
    this._menuDiv = menuDiv;

    this._startButton.addEventListener("click", () => {
      this.engine.goToScene("game");
      this._menuDiv.classList.add("hidden");
    });
  }

  public override onInitialize(engine: Engine): void {
    this._menuDiv.classList.remove("hidden");
  }
}
