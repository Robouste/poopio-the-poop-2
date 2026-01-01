import { Config } from "@utils/config";
import { Resources } from "@utils/resources";
import {
  Color,
  Engine,
  Font,
  Label,
  Scene,
  TextAlign,
  Timer,
  vec,
} from "excalibur";
import { AncientDragon } from "../actors/ancient-dragon.actor";
import { Background } from "../actors/background.actor";
import { Ground } from "../actors/ground.actor";
import { Hero } from "../actors/hero.actor";
import { LightningFlash } from "../actors/lightning-flash.actor";
import { CloudFactory } from "../factories/cloud.factory";
import { DragonFactory } from "../factories/dragon.factory";
import { ObsticleFactory } from "../factories/obsticle.factory";

const bestScoreKey = "ptp2-best-score";
const labelsOffset = 10;

export class GameScene extends Scene {
  private _ground!: Ground;
  private _hero!: Hero;
  private _obsticleFactory = new ObsticleFactory(this);
  private _cloudFactory = new CloudFactory(this);
  private _dragonFactory = new DragonFactory(this);
  private _isPlaying = false;
  private _background!: Background;
  private _isBossStage = false;

  private _scoreLabel = new Label({
    text: "Score: 0",
    x: labelsOffset,
    y: labelsOffset,
    z: 1,
    font: new Font({
      size: 20,
      color: Color.White,
    }),
  });
  private _jumpLabel!: Label;
  private _shootLabel!: Label;
  private _bestLabel!: Label;
  private _startGameLabel!: Label;
  private _best = 0;
  private _score = 0;

  override onInitialize(engine: Engine): void {
    this._background = new Background(engine);
    this.add(this._background);

    this._hero = new Hero(engine, this);
    this.add(this._hero);

    this._ground = new Ground(engine);
    this.add(this._ground);

    this._initLabels(engine);
    this._showStartInstructions();
  }

  public incrementScore(amount: number): void {
    Resources.Sounds.ScoreUp.play({
      volume: 0.1,
    });
    this._score += amount;
    this._scoreLabel.text = `Score: ${this._score}`;

    if (this._score >= 500 && !this._isBossStage) {
      this._initBossStage();
    }
  }

  public gameOver(): void {
    Resources.Sounds.GameOver.play();
    this._setBestScore(this._score);
    this._stop();

    this._showStartInstructions();
  }

  private _start(): void {
    this._isPlaying = true;
    Resources.Musics.Bgm.play();

    this._ground.start();
    this._hero.start();
    this._obsticleFactory.start();
    this._dragonFactory.start();
    this._cloudFactory.start();
  }

  private _reset(): void {
    this._obsticleFactory.reset();
    this._dragonFactory.reset();
    this._cloudFactory.reset();
  }

  private _stop(): void {
    this._isPlaying = false;
    Resources.Musics.Bgm.stop();
    this._ground.stop();
    this._hero.stop();
    this._obsticleFactory.stop();
    this._dragonFactory.stop();
    this._cloudFactory.stop();

    if (this._isBossStage) {
      this._isBossStage = false;
      this._background.restore(0);
      const boss = this.actors.find((actor) => actor instanceof AncientDragon);
      boss?.kill();
    }
  }

  private _initLabels(engine: Engine): void {
    this._startGameLabel = new Label({
      text: "Touch anything to start",
      x: engine.screen.drawWidth / 2,
      y: engine.screen.drawHeight / 2,
      z: 3,
      font: new Font({
        size: 30,
        color: Color.White,
        textAlign: TextAlign.Center,
      }),
    });

    this._bestLabel = new Label({
      text: "Best: 0",
      x: engine.screen.drawWidth - labelsOffset,
      y: labelsOffset,
      z: 1,
      anchor: vec(1, 0),
      font: new Font({
        size: 20,
        color: Color.White,
        textAlign: TextAlign.Right,
      }),
    });

    this._jumpLabel = new Label({
      text: "Jump: Space / Left Click / Tap Left",
      x: this._startGameLabel.pos.x,
      y: this._startGameLabel.pos.y + 40,
      z: 1,
      font: new Font({
        size: 16,
        color: Color.White,
        textAlign: TextAlign.Center,
      }),
    });

    this._shootLabel = new Label({
      text: "Shoot: Enter / Right Click / Tap Right",
      x: this._startGameLabel.pos.x,
      y: this._jumpLabel.pos.y + 25,
      z: 1,
      font: new Font({
        size: 16,
        color: Color.White,
        textAlign: TextAlign.Center,
      }),
    });

    this.add(this._scoreLabel);
    this.add(this._bestLabel);
    this.add(this._startGameLabel);
    this.add(this._jumpLabel);
    this.add(this._shootLabel);

    const bestScore = localStorage.getItem(bestScoreKey);

    if (bestScore) {
      this._best = +bestScore;
      this._setBestScore(this._best);
    } else {
      this._setBestScore(0);
    }
  }

  private _showStartInstructions(): void {
    this._startGameLabel.graphics.isVisible = true;
    this._jumpLabel.graphics.isVisible = true;
    this._shootLabel.graphics.isVisible = true;

    const restart = () => {
      if (this._isPlaying) {
        return;
      }

      this._reset();
      this._start();
      this._startGameLabel.graphics.isVisible = false;
      this._jumpLabel.graphics.isVisible = false;
      this._shootLabel.graphics.isVisible = false;
      this._score = 0;
      this._scoreLabel.text = `Score: ${this._score}`;
    };

    this.engine.input.pointers.once("down", restart);
    this.engine.input.keyboard.once("press", restart);
  }

  private _setBestScore(score: number): void {
    if (score > this._best) {
      localStorage.setItem(bestScoreKey, score.toString());
      this._best = score;
    }

    this._bestLabel.text = `Best: ${this._best}`;
  }

  private _initBossStage(): void {
    this._isBossStage = true;
    this._obsticleFactory.pause();
    this._dragonFactory.setAmount(2);
    this._fadeOutBgm();
    this._background.fadeToDark(5000);

    const lightning = new LightningFlash(this);
    this.add(lightning);

    const lightningTimer = new Timer({
      interval: 800,
      repeats: true,
      randomRange: [200, 500],
      numberOfRepeats: 5,
      action: () => {
        lightning.strike();
      },
      onComplete: () => lightning.kill(),
    });

    this.add(lightningTimer);
    lightningTimer.start();

    const bossTimer = new Timer({
      interval: 5000,
      numberOfRepeats: 1,
      repeats: true,
      action: () => this._spawnBoss(),
    });

    this.add(bossTimer);
    bossTimer.start();
  }

  private _spawnBoss(): void {
    Resources.Musics.Boss.play();

    const boss = new AncientDragon(
      vec(
        this.engine.screen.drawWidth,
        this.engine.screen.drawHeight -
          Config.GroundHeight -
          Config.ObsticleMaxHeight -
          100
      ),
      this
    );

    this.add(boss);

    boss.on("kill", () => {
      this._background.restore(5000);
      this._obsticleFactory.start();
      this._dragonFactory.setAmount(1);
      Resources.Musics.Boss.stop();
    });
  }

  private _fadeOutBgm(): void {
    const fadeOutTimer = new Timer({
      interval: 200,
      repeats: true,
      action: () => {
        Resources.Musics.Bgm.volume -= 0.1;

        if (Resources.Musics.Bgm.volume <= 0) {
          Resources.Musics.Bgm.stop();
          fadeOutTimer.cancel();
          this.remove(fadeOutTimer);
          Resources.Musics.Bgm.volume = 1;
        }
      },
    });

    this.add(fadeOutTimer);
    fadeOutTimer.start();
  }
}
