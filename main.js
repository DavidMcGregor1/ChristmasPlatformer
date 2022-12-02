import Phaser, { Game } from "phaser";
let player;
let platforms;
let water;
let cursors;
let canMove;
// let sun;

const myGame = new Game({
  type: Phaser.AUTO,
  width: 793,
  height: 540,

  // width: 1500,
  // height: 540,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload() {
      // Code that needs to run before the game is on the screen
      this.load.image("background", "./assets/Picture1.jpg");
      this.load.spritesheet("person", "./assets/sprite.png", {
        frameWidth: 32,
        frameHeight: 32,
      });
      this.load.image("forest", "./assets/forest.png");
      this.load.image("leftPlatform", "./assets/leftPlatform.png");
      this.load.image("bottomFatPlatform", "./assets/bottomFatPlatform.png");
      this.load.image(
        "bottomSkinnyPlatform",
        "./assets/bottomSkinnyPlatform.png"
      );

      this.load.image("rightPlatform", "./assets/rightPlatform.png");
      this.load.image("topPlatform", "./assets/topPlatform.png");
      this.load.image("waveRight", "./assets/waveRight.png");
      this.load.image("present", "./assets/present.png");
      this.load.image("sun", "./assets/sun.png");

      cursors = this.input.keyboard.createCursorKeys();
    },
    create() {
      // Code that runs as soon as the game is on the screen
      canMove = true;
      this.add.image(396, 300, "background");
      player = this.physics.add.sprite(300, 300, "person");
      player.setScale(1.2);
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      water = this.physics.add.staticGroup();

      platforms = this.physics.add.staticGroup();
      platforms
        .create(80, 275, "leftPlatform")
        .setScale(0.85)
        .setAlpha()
        .refreshBody();

      platforms
        .create(400, 442, "bottomFatPlatform")
        .setScale(0.82)
        .setAlpha()
        .refreshBody();

      platforms
        .create(400, 517, "bottomSkinnyPlatform")
        .setScale(0.8)
        .setAlpha()
        .refreshBody();

      platforms
        .create(700, 275, "rightPlatform")
        .setScale(0.8)
        .setAlpha()
        .refreshBody();

      // platforms
      //   .create(400, 182, "topPlatform")
      //   .setScale(0.8)
      //   .setAlpha()
      //   .refreshBody();

      water
        .create(710, 525, "waveRight")
        .setScale(0.8)
        .setAlpha()
        .refreshBody();

      water.create(80, 525, "waveRight").setScale(0.8).setAlpha().refreshBody();

      this.physics.add.collider(player, platforms);
      this.physics.add.collider(player, water, () => {
        canMove = false;
        this.add.text(100, 250, "GAME OVER", {
          fontFamily: "Arial",
          color: "red",
          fontSize: 100,
        });
        this.add.text(100, 100, "Click to restart", {
          fontFamily: "Arial",
          color: "black",
          fontSize: 80,
        });

        this.input.on("pointerup", () => {
          canMove = true;
          this.scene.restart();
        });
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("person", {
          start: 9,
          end: 11,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("person", {
          start: 3,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("person", { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1,
      });

      const presents = this.physics.add.group({
        key: "present",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 63 },
      });

      presents.children.iterate(function (child) {
        child.setBounceY([Phaser.Math.FloatBetween(0.4, 0.8)]);
      });
      this.physics.add.collider(presents, platforms);
      this.physics.add.overlap(player, presents, collect, null, this);

      const suns = this.physics.add.group();
      this.physics.add.collider(suns, platforms);

      // this.physics.add.collider(player, suns, sunTouched, null, this);
      this.physics.add.collider(player, suns, () => {
        canMove = false;
        this.add.text(100, 250, "GAME OVER", {
          fontFamily: "Arial",
          color: "red",
          fontSize: 100,
        });
        this.add.text(100, 100, "Click to restart", {
          fontFamily: "Arial",
          color: "black",
          fontSize: 80,
        });

        this.input.on("pointerup", () => {
          canMove = true;
          this.scene.restart();
        });
      });

      function sunTouched(player, sun) {
        this.physics.pause();
        this.player.setTint(0xff000);
        this.player.anims.play("turn");
      }

      const scoreText = this.add.text(20, 60, "Score: 0", {
        fontSize: "32px",
        fill: "#000",
      });
      let score = 0;

      function collect(player, present) {
        present.disableBody(true, true);
        score += 1;
        scoreText.setText("Score:" + score);

        if (presents.countActive(true) === 0) {
          presents.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
          });

          var x =
            player.x < 400
              ? Phaser.Math.Between(400, 800)
              : Phaser.Math.Between(0, 400);

          const sun = suns.create(x, 16, "sun");
          sun.setBounce(1);
          sun.setCollideWorldBounds(true);
          sun.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
      }
    },
    update() {
      // Code that runs for every frame rendered in the browser

      if (canMove) {
        if (cursors.right.isDown) {
          player.setVelocityX(290);
          player.anims.play("right", true);
        } else if (cursors.left.isDown) {
          player.setVelocityX(-290);
          player.anims.play("left", true);
        } else if (cursors.up.isDown) {
          player.setVelocityY(-290);
        } else {
          player.setVelocityX(0);
          // player.setVelocityY(0);
          player.anims.play("idle", true);
        }
      }
    },
  },
});
