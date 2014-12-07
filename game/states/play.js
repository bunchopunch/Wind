
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      var game = this.game;
      var levels = [
        [5, 3, 1],
        [9, 5, 2]
      ]
      var playerCursorKeys = game.input.keyboard.createCursorKeys();
      var currentLevel = 1;

      // Set up physics
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // No. No bounds. Just adds complexity. 
      // Adds the need for more complex star generation and physics.
      // Draw the play boundry.
      // var boundsGfx = this.add.graphics(game.world.centerX, game.world.centerY); 
      // boundsGfx.lineStyle(5, 0xCCCCCC);
      // boundsGfx.drawCircle(0, 0, 300);

      // Create the stars

      console.log(game.world.width);
      for (var i = 0; i < levels[currentLevel - 1][1 - 1]; i++) {
        this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'small');
      };
      for (var i = 0; i < levels[currentLevel - 1][2 - 1]; i++) {
        this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'medium');
      };
      for (var i = 0; i < levels[currentLevel - 1][3 - 1]; i++) {
        this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'large');
      };

      // Create the player ship
      this.createPlayer( (this.game.world.centerX + 100), (this.game.world.centerY + 100) );



//      this.game.physics.startSystem(Phaser.Physics.ARCADE);
//      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
//      this.sprite.inputEnabled = true;
//      
//      this.game.physics.arcade.enable(this.sprite);
//      this.sprite.body.collideWorldBounds = true;
//      this.sprite.body.bounce.setTo(1,1);
//      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
//      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
//
//      this.sprite.events.onInputDown.add(this.clickListener, this);

    },
    update: function() {

//      if (this.playerCursorKeys.up.isDown) {
//        game.physics.arcade.accelerationFormRotation(sprite.rotation, 200, spr)
//      }


    },
    // HELPER THINGS
    randomPostion: function(axis){
      if (axis === 'x') {
        var randomMax = this.game.world.width;
      } else {
        var randomMax = this.game.world.height;
      }
      return Math.floor(Math.random() * randomMax)
    },
    createPlayer: function(newPlayerX, newPlayerY){
      this.player = this.game.add.sprite(newPlayerX, newPlayerY, 'ship');
      this.player.anchor.set(0.5);
    },
    createStar: function(newStarX, newStarY, newStarSize){
      if(newStarSize === 'small') {
        this.game.add.sprite(newStarX, newStarY, 'star14');
      } else if (newStarSize === 'medium') {
        this.game.add.sprite(newStarX, newStarY, 'star32');
      } else if (newStarSize === 'large') {
        this.game.add.sprite(newStarX, newStarY, 'star64');
      }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;