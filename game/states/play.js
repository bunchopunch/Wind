
  'use strict';
  function Play() {}
  Play.prototype = {
    playerCursorKeys: null,
    levelObjects: null,
    player: null,
    create: function() {
      var game = this.game;
      var levels = [
          [5, 3, 1, 200],
          [9, 5, 2, 400],
          [12, 8, 3, 600],
          [15, 11, 4, 800]
        ]
      var currentLevel = 1;

      this.playerCursorKeys = game.input.keyboard.createCursorKeys();
      // Set up physics
      game.physics.startSystem(Phaser.Physics.ARCADE);

      this.levelObjects = this.game.add.group();
      this.levelObjects.x = 500;
      this.levelObjects.y = 350;

      // Create the stars
      for (var i = 0; i < levels[currentLevel - 1][1 - 1]; i++) {
        this.createStar(game.world.randomX, this.randomPostion('y'), 'small');
      };
      for (var i = 0; i < levels[currentLevel - 1][2 - 1]; i++) {
        this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'medium');
      };
      for (var i = 0; i < levels[currentLevel - 1][3 - 1]; i++) {
        this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'large');
      };

      // Create a goal object
      this.createGoal(levels[currentLevel - 1][3]);

      // Create the player ship
      this.createPlayer( this.game.world.centerX, this.game.world.centerY );

//      this.sprite.events.onInputDown.add(this.clickListener, this);

    },

    update: function() {
      if (this.playerCursorKeys.up.isDown) {
        // we need to rotate and move the world here.
//        game.physics.arcade.accelerationFormRotation(sprite.rotation, 200, spr)
      }

      if (this.playerCursorKeys.left.isDown) {
        // just world rotation
//        this.game.world.rotation -= 0.05;
        this.levelObjects.rotation -= 0.05;
      }

      if (this.playerCursorKeys.right.isDown) {
        this.levelObjects.rotation += 0.05;
      }

      // Less than 3 hours left. Maybe no back key support.


    },
    // HELPER THINGS
    randomInRange: function(min, max){
      var returning = Math.floor(Math.random() * (min - max)) + min;
      return returning; // PLUSSSSS MIIIIIINNNNNN AT THE ENNNNNNNNDDDDDDDDDDDDD. I'm
    },

    randomPostion: function(axis){
      if (axis === 'x') {
        return this.game.world.randomX - this.game.world.width
      } else {
        var hay = this.game.world.randomY;
        console.log(hay)
        return hay - this.game.world.height/2
      }
    },

    createStar: function(newStarX, newStarY, newStarSize){
      if(newStarSize === 'small') {
        this.levelObjects.add(this.game.add.sprite(newStarX, newStarY, 'star14') );
      } else if (newStarSize === 'medium') {
        this.levelObjects.add(this.game.add.sprite(newStarX, newStarY, 'star32') );
      } else if (newStarSize === 'large') {
        this.levelObjects.add(this.game.add.sprite(newStarX, newStarY, 'star64') );
      }
    },

    generateDistantX: function(minDistance){
      if (Math.random() >= 0.5) {
        var x1 = this.randomInRange(0, minDistance);
        return x1
      } else {
        var x2 = this.randomInRange(this.game.world.centerX + minDistance, this.game.world.width);
        return x2
      }
    },

    generateDistantY: function(minDistance){
      if (Math.random() >= 0.5) {
        var y1 = this.randomInRange(0, (minDistance * 0.5));
        return y1
      } else {
        var y2 = this.randomInRange(this.game.world.centerY + (minDistance * 0.5), this.game.world.height);
        return y2
      }
    },

    createGoal: function(minDistance){
//        minDistance = minDistance/2;
//        var goal = this.game.add.sprite(this.generateDistantX(minDistance), this.generateDistantY(minDistance), 'goal');
        var goal = this.game.add.sprite(this.randomPostion('x'), this.randomPostion('y'), 'goal');
        this.levelObjects.add(goal);
    },

    createPlayer: function(newPlayerX, newPlayerY){
      this.player = this.game.add.sprite(newPlayerX, newPlayerY, 'ship');
      this.player.anchor.set(0.5);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
