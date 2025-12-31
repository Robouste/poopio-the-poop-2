import { DisplayMode, Engine, FadeInOut, vec } from "excalibur";
import { GameScene } from "./scenes/game.scene";
import { MainMenuScene } from "./scenes/main-menu.scene";
import { calculateExPixelConversion } from "./utils/pixel-conversion";
import { loader } from "./utils/resources";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 1400,
  displayMode: DisplayMode.FitScreen, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  pixelRatio: 2,
  scenes: {
    start: MainMenuScene,
    game: GameScene,
  },
  canvasElementId: "game",
  physics: {
    gravity: vec(0, 800),
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.screen.events.on("resize", () => calculateExPixelConversion(game.screen));

game
  .start("game", {
    loader, // Optional loader (but needed for loading images/sounds)
    inTransition: new FadeInOut({
      // Optional in transition
      duration: 1000,
      direction: "in",
      // color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    // Do something after the game starts
    calculateExPixelConversion(game.screen);
  });
