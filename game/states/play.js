'use strict';
function Play() {}
Play.prototype = {
  multiplier: function(){
    if (this.game.uiState.multiplier === undefined){
      return 1;
    } else {
      return this.game.uiState.multiplier;
    }
  },
  textStyles: {
    header: { font: '65px Arial', fill: '#ffffff', align: 'center'},
    subheader: { font: '24px Arial', fill: '#ffffff', align: 'center'},
    button: { font: '35px Arial', fill: '#ffffff', align: 'center', cursor: 'pointer'}
  },
  playerCursorKeys: null,
  starLayer: null,
  goalLayer: null,
  player: null,
  goal: null,
  create: function() {
    var game = this.game;
    var i = 0;
    var difficulty = [5, 3, 1];
    console.log(game.uiState);

    this.background = this.game.add.tileSprite(0, 0, 1000, 750, 'background');

    // Create a layer for the Background
    this.backgroundLayer = this.game.add.group();

    this.background = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.stage.bounds.height, 'background');

    this.backgroundLayer.add(this.background);

    // Create the nebula
    for (i = 0; i < 8; i++) {
      this.backgroundLayer.add(this.createNebula() );
    }

    // Init keyboard
    this.playerCursorKeys = game.input.keyboard.createCursorKeys();

    // Init game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Init group for stars
    this.starLayer = this.game.add.group();
    this.starLayer.x = 500;
    this.starLayer.y = 350;

    // Init group for stars
    this.goalLayer = this.game.add.group();
    this.goalLayer.x = 500;
    this.goalLayer.y = 350;

    // Create the stars
    for (i = 0; i < (difficulty[0] * this.multiplier() ); i++) {
      this.starLayer.add(this.createStar(this.rndLayerPos('x', 16), this.rndLayerPos('y', 16), 'small'));
    }
    for (i = 0; i < difficulty[1] * this.multiplier() ; i++) {
      this.starLayer.add(this.createStar(this.rndLayerPos('x', 32), this.rndLayerPos('y', 32), 'medium'));
    }
    for (i = 0; i < difficulty[2] * this.multiplier() ; i++) {
      this.starLayer.add(this.createStar(this.rndLayerPos('x', 64), this.rndLayerPos('y', 64), 'large'));
    }

    // Create a goal object
    this.goalLayer.add(this.goal = this.createGoal(difficulty[3]) );

    // Create the player ship
    this.player = this.createPlayer( this.game.world.centerX, this.game.world.centerY );
  },

  update: function() {
    this.game.physics.arcade.collide(this.player, this.starLayer, this.deathHandler, null, this);
    this.game.physics.arcade.collide(this.player, this.goal, this.winHandler, null, this);

    if (this.playerCursorKeys.up.isDown) {
      this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 200, this.player.body.acceleration);
    } else {
      this.player.body.acceleration.set(0);
    }

    if (this.playerCursorKeys.left.isDown) {
        this.player.body.angularVelocity = -200;
    } else if (this.playerCursorKeys.right.isDown) {
        this.player.body.angularVelocity = 200;
    } else {
      this.player.body.angularVelocity = 0;
    }

    this.screenWrap(this.player);

//      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON); The board is too small for camera lockon
//      this.game.camera.focusOnXY(this.player.x, this.player.y + this.player.height - this.camera.view.halfHeight);

  },

  // COLLISION HANDLERS

  restart: function() {
    this.game.state.start('play');
  },

  hardRestart: function() {
    this.game.uiState.lives = 3;
    this.game.uiState.multiplier = 1;
    this.game.uiState.level = 1;
    this.game.uiState.score = 0;
    this.game.state.start('play');
  },

  deathHandler: function(){
    // Game Over
    if (this.game.uiState.lives <= 0){
      this.stateText = this.game.add.sprite(this.game.world.centerX, 250, 'gameover');
//      this.titleText = this.game.add.text(this.game.world.centerX, 300, 'GAME OVERED', this.textStyles.header);
      this.scoreText = this.game.add.text(this.game.world.centerX, 355, 'YOUR SCORE: ' + this.game.uiState.score, this.textStyles.subheader);
      this.restartButton = this.game.add.button(this.game.world.centerX, 450, 'button', this.hardRestart, this);
      this.buttonText = this.game.add.text(this.game.world.centerX, 450, 'RESTART', this.textStyles.button);
      this.stateText.anchor.setTo(0.5, 0.5);
//      this.titleText.anchor.setTo(0.5, 0.5);
      this.scoreText.anchor.setTo(0.5, 0.5);
      this.restartButton.anchor.setTo(0.5, 0.5);
      this.buttonText.anchor.setTo(0.5, 0.5);


    // Lost a level
    } else {
      this.stateText = this.game.add.sprite(this.game.world.centerX, 300, 'lose');
      this.stateText.anchor.setTo(0.5, 0.5);
//      this.titleText = this.game.add.text(this.game.world.centerX, 300, 'DEADED', this.textStyles.header);
//      this.titleText.anchor.setTo(0.5, 0.5);
      this.game.uiState.lives--;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.restart, this);
    }
  },

  // Won a level
  winHandler: function(){
    this.stateText = this.game.add.sprite(this.game.world.centerX, 300, 'win');
    this.stateText.anchor.setTo(0.5, 0.5);
//    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'WINNED', this.textStyles.header);
//    this.titleText.anchor.setTo(0.5, 0.5);
    this.game.uiState.multiplier++;
    this.game.uiState.score += 1000;
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.restart, this);
  },

  // OTHER EVENT HANDLERS

  screenWrap: function (sprite) {
    if (sprite.x < 0) {
        sprite.x = this.game.width;
    } else if (sprite.x > this.game.width) {
        sprite.x = 0;
    }

    if (sprite.y < 0) {
        sprite.y = this.game.height;
    } else if (sprite.y > this.game.height) {
        sprite.y = 0;
    }
  },

  // GAME OBJECT FACTORIES

  rndLayerPos: function(axis, buffer){
    var randomPos = null;
    if (axis === 'x') {
      randomPos = this.game.world.randomX - this.game.world.width/2;
      // Be sure the coords have allowed for the specified buffer
      if (randomPos <= this.game.world.width/2 * -1 + buffer){
        randomPos = this.game.world.width/2 * -1 + 0;
      } else if (randomPos >= this.game.world.width/2 - buffer) {
        randomPos = this.game.world.width/2 * -1 + buffer;
      }

    } else if (axis === 'y') {

      randomPos = this.game.world.randomY - this.game.world.height/2;
      if (randomPos <= this.game.world.height/2 * -1 + buffer){
        randomPos = this.game.world.height/2 * -1 + 0;
      } else if (randomPos >= this.game.world.height/2 - buffer) {
        randomPos = this.game.world.height/2 * -1 + buffer;
      }

    } else {
      randomPos = 0;
    }

    return randomPos;
  },

  createNebula: function(){
    var newNebula = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'nebula' + this.game.rnd.integerInRange(1, 3));
    this.game.physics.enable(newNebula, Phaser.Physics.ARCADE);
    newNebula.alpha = 0.3;
    newNebula.body.enable;
    newNebula.body.angularVelocity = this.game.rnd.integerInRange(-2, 2);

    return newNebula;
  },

  createStar: function(newStarX, newStarY, newStarSize){
    var starImage = 'star14';
    if(newStarSize === 'small') {
      starImage = 'star14';
    } else if (newStarSize === 'medium') {
      starImage = 'star32';
    } else if (newStarSize === 'large') {
      starImage = 'star64';
    }

    var newStar = this.game.add.sprite(newStarX, newStarY, starImage);
    this.game.physics.enable(newStar, Phaser.Physics.ARCADE);
    newStar.body.enable;
    newStar.body.immovable = true;

    return newStar;
  },

  createGoal: function(){
    var newGoal = this.game.add.sprite(this.rndLayerPos('x', 64), this.rndLayerPos('y', 64), 'goal');
    this.game.physics.enable(newGoal, Phaser.Physics.ARCADE);

    newGoal.body.enable;
    newGoal.body.immovable = true;

    return newGoal;
  },

  createPlayer: function(newPlayerX, newPlayerY){
    var newPlayer = this.game.add.sprite(newPlayerX, newPlayerY, 'ship');
    this.game.physics.enable(newPlayer, Phaser.Physics.ARCADE);

    newPlayer.body.enable;
    newPlayer.anchor.set(0.5);
    newPlayer.angle = 1.5 * Math.PI;
    newPlayer.rotation = 0;

    return newPlayer;
  },
};

module.exports = Play;
