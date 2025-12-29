import { Resources } from "@utils/resources";
import { Color, Engine, Font, Label, Scene, TextAlign, vec } from "excalibur";
import { Ground } from "../actors/ground.actor";
import { Hero } from "../actors/hero.actor";
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
  }

  public gameOver(): void {
    Resources.Sounds.GameOver.play();
    this._setBestScore(this._score);
    this._stop();

    this._showStartInstructions();
  }

  private _start(): void {
    this._isPlaying = true;
    // Resources.Musics.Bgm.loop = true;
    // Resources.Musics.Bgm.play();

    this._ground.start();
    this._hero.start();
    this._obsticleFactory.start();
    this._dragonFactory.start();
    this._cloudFactory.start();
  }

  private _stop(): void {
    this._isPlaying = false;
    Resources.Musics.Bgm.stop();
    this._ground.stop();
    this._hero.stop();
    this._obsticleFactory.stop();
    this._dragonFactory.stop();
    this._cloudFactory.stop();
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
    this._obsticleFactory.stop();
    this._dragonFactory.setAmount(3);
  }
}
