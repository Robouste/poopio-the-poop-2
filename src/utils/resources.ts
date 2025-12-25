import { ImageSource, ImageWrapping, Loader, Sound } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  // Images
  Images: {
    Hero: new ImageSource("./images/hero.png"),
    Ground: new ImageSource("./images/grounds/ground-grass-1.png", {
      wrapping: ImageWrapping.Repeat,
    }),
    HeroBullet: new ImageSource("./images/bullets/hero-bullet.png"),
  },
  // Sounds
  Sounds: {
    Jump: new Sound("./sounds/jump.wav"),
    DoubleJump: new Sound("./sounds/double-jump.wav"),
    Fire: new Sound("./sounds/fire.mp3"),
    GameOver: new Sound("./sounds/game-over.mp3"),
    Impact: new Sound("./sounds/impact.wav"),
    LevelUp: new Sound("./sounds/level-up.wav"),
    ImpactBoss: new Sound("./sounds/impact-boss.wav"),
  },
} as const;

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();

for (const res of Object.values(Resources.Images)) {
  loader.addResource(res);
}

for (const res of Object.values(Resources.Sounds)) {
  loader.addResource(res);
}
