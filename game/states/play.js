
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

      var velocityFunction = function(that, rotateTo){
        console.log(that);
        that.game.physics.arcade.velocityFromAngle(rotateTo, 300, that.body.velocity)
      };      


//      this.levelObjects.setAll('body.velocity.x', 0);
//      this.levelObjects.setAll('body.velocity.y', 0);
//      this.levelObjects.setAll('body.angularVelocity', 0);

      if (this.playerCursorKeys.up.isDown) {

//        this.levelObjects.accelerationFromRotation(this.levelObjects.rotation, 200);
        // we need to rotate and move the world here.
//        game.physics.arcade.accelerationFormRotation(sprite.rotation, 200, spr)

//          this.levelObjects.setAll('body.velocity.x', 200);
//          this.levelObjects.setAll('body.angularVelocity', 200);

        var rotateTo = this.levelObjects.rotation;
        var that = this

        this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 300, this.player.body.acceleration);
//        this.player(velocityFunction, 'body', false, that, rotateTo);
      } else {
        this.player.body.acceleration.set(0)
      }

      if (this.playerCursorKeys.left.isDown) {
        // just world rotation
//        this.game.world.rotation -= 0.05;
//        this.levelObjects.setAll('body.angle', this.levelObjects.rotation);

//        this.player.rotation -= 0.05;
          this.player.body.angularVelocity = -300;
      } else {
//        this.player.body.angularVelocity = 0;
      }

      if (this.playerCursorKeys.right.isDown) {
        this.player.rotation += 0.05;
//        this.levelObjects.setAll('body.angle', this.levelObjects.rotation);

          this.player.body.angularVelocity = 300;
      } else {
        this.player.body.angularVelocity = 0;
      }

//      this.levelObjects.setAll('body.velocity.x', 0);
//      this.levelObjects.setAll('body.velocity.y', 0);


      // Less than 3 hours left. Maybe no back key support.
      this.game.camera.focusOnXY(this.player.x, this.player.y + this.player.height - this.camera.view.halfHeight);

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
        return hay - this.game.world.height/2
      }
    },

    createStar: function(newStarX, newStarY, newStarSize){
//        this.levelObjects.add(this.game.add.sprite(newStarX, newStarY, 'star64') );
      var starImage = 'star14';
      if(newStarSize === 'small') {
        starImage = 'star14';
      } else if (newStarSize === 'medium') {
        starImage = 'star32';
      } else if (newStarSize === 'large') {
        starImage = 'star64';
      }
      var newStar = this.game.add.sprite(newStarX, newStarY, starImage)
      this.game.physics.enable(newStar, Phaser.Physics.ARCADE);

      newStar.body.enable;

//      this.game.physics.arcade.velocityFromAngle(this.levelObjects.angle, 300)
//      newStar.body.velocity.x = 200;
      this.levelObjects.add(newStar);

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
      this.game.physics.enable(goal, Phaser.Physics.ARCADE);
      this.levelObjects.add(goal);
    },

    createPlayer: function(newPlayerX, newPlayerY){
      this.player = this.game.add.sprite(newPlayerX, newPlayerY, 'ship');
      this.player.anchor.set(0.5);
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
