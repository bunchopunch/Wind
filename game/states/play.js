
  'use strict';
  function Play(newMultiplier) {}
  Play.prototype = {
    multiplier: function(){
      if (newMultiplier === undefined){
        return 1;
      } else {
        return newMultiplier;
      }
    },
    playerCursorKeys: null,
    starLayer: null,
    goalLayer: null,
    player: null,
    goal: null,
    create: function() {
      var game = this.game;
      var levels = [
          [5, 3, 1],
          [9, 5, 2, 400],
          [12, 8, 3, 600],
          [15, 11, 4, 800]
        ]
      var currentLevel = 4;

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
      for (var i = 0; i < levels[currentLevel - 1][1 - 1]; i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'small'));
      };
      for (var i = 0; i < levels[currentLevel - 1][2 - 1]; i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'medium'));
      };
      for (var i = 0; i < levels[currentLevel - 1][3 - 1]; i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'large'));
      };

      // Create a goal object
      this.goalLayer.add(this.goal = this.createGoal(levels[currentLevel - 1][3]));

      // Create the player ship
      this.player = this.createPlayer( this.game.world.centerX, this.game.world.centerY );
    },

    update: function() {
      this.game.physics.arcade.collide(this.player, this.starLayer, this.deathHandler, null, this);
      this.game.physics.arcade.collide(this.player, this.goal, this.winHandler, null, this);

      if (this.playerCursorKeys.up.isDown) {
        this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 200, this.player.body.acceleration);
      } else {
        this.player.body.acceleration.set(0)
      }

      if (this.playerCursorKeys.left.isDown) {
          this.player.body.angularVelocity = -200;
      } else if (this.playerCursorKeys.right.isDown) {
          this.player.body.angularVelocity = 200;
      } else {
        this.player.body.angularVelocity = 0;
      }

      this.screenWrap(this.player);

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON)

//      this.game.camera.focusOnXY(this.player.x, this.player.y + this.player.height - this.camera.view.halfHeight);

    },

    // COLLISION HANDLERS

    deathHandler: function(){
      var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(this.game.world.centerX, 300, 'DEADED', style);
      this.titleText.anchor.setTo(0.5, 0.5);
    },

    winHandler: function(){
      var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(this.game.world.centerX, 300, 'WINNED', style);
      this.titleText.anchor.setTo(0.5, 0.5);
    },

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

    rndLayerPos: function(axis){
      if (axis === 'x') {
        return this.game.world.randomX - this.game.world.width/2;
      } else if (axis === 'y') {
        return this.game.world.randomY - this.game.world.height/2;
      } else {
        return 0;
      }
    },

//    generateDistantX: function(minDistance){
//      if (Math.random() >= 0.5) {
//        var x1 = this.game.rad.integerInRange(0, minDistance);
//        return x1
//      } else {
//        var x2 = this.game.rad.integerInRange(this.game.world.centerX + minDistance, this.game.world.width);
//        return x2
//      }
//    },
//
//    generateDistantY: function(minDistance){
//      if (Math.random() >= 0.5) {
//        var y1 = this.game.rad.integerInRange(0, (minDistance * 0.5));
//        return y1
//      } else {
//        var y2 = this.game.rad.integerInRange(this.game.world.centerY + (minDistance * 0.5), this.game.world.height);
//        return y2
//      }
//    },

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

    createGoal: function(minDistance){
      var newGoal = this.game.add.sprite(this.rndLayerPos('x'), this.rndLayerPos('y'), 'goal');
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

    // OLD
//    clickListener: function() {
//      this.game.state.start('gameover');
//    }
  };

  module.exports = Play;
