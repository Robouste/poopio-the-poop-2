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
    Plunger: new ImageSource("./images/obsticles/plunger.png"),
    ToiletPaper: new ImageSource("./images/obsticles/toilet-paper.png"),
    ImpactInvincibleEffect: new ImageSource(
      "./images/bullets/impact-invincible-effect.png"
    ),
    Dragon: new ImageSource("./images/enemies/dragon.png"),
    AncientDragon: new ImageSource("./images/enemies/ancient-dragon.png"),
    Cloud1: new ImageSource("./images/clouds/cloud1.png"),
    Cloud2: new ImageSource("./images/clouds/cloud2.png"),
    Cloud3: new ImageSource("./images/clouds/cloud3.png"),
    Cloud4: new ImageSource("./images/clouds/cloud4.png"),
    HealthBar: new ImageSource("./images/ui/health-bar.png"),
    HealthBarBorder: new ImageSource("./images/ui/health-bar-border.png"),
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
    ImpactInvincible: new Sound("./sounds/impact-invincible.mp3"),
    ScoreUp: new Sound("./sounds/score-up.wav"),
  },
  Musics: {
    Bgm: new Sound("./musics/bgm.mp3"),
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

for (const res of Object.values(Resources.Musics)) {
  loader.addResource(res);
}
