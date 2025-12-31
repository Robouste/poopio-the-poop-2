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
    FireOrb: new ImageSource("./images/bullets/fire-orb.png"),
    Shockwave: new ImageSource("./images/bullets/shockwave.png"),
  },
  // Sounds
  Sounds: {
    Jump: new Sound("./sounds/jump.wav"),
    DoubleJump: new Sound("./sounds/double-jump.wav"),
    Fire: new Sound("./sounds/attacks/fire.mp3"),
    GameOver: new Sound("./sounds/game-over.mp3"),
    LevelUp: new Sound("./sounds/level-up.wav"),
    Impact: new Sound("./sounds/impacts/impact.wav"),
    ImpactBoss: new Sound("./sounds/impacts/impact-boss.wav"),
    ImpactInvincible: new Sound("./sounds/impacts/impact-invincible.mp3"),
    ScoreUp: new Sound("./sounds/score-up.wav"),
    FireOrb: new Sound("./sounds/attacks/fire-orb.mp3"),
    Shockwave: new Sound("./sounds/attacks/shockwave.mp3"),
  },
  Musics: {
    Bgm: new Sound({
      paths: ["./musics/bgm.mp3"],
      loop: true,
    }),
    Boss: new Sound({
      paths: ["./musics/boss.mp3"],
      loop: true,
    }),
  },
} as const;

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();

for (const key of Object.values(Resources)) {
  for (const res of Object.values(key)) {
    loader.addResource(res);
  }
}
