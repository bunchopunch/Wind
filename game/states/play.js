
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {


//      var waterLevel = 50;
//      var config = {
//        width: 1000,
//        height: 700
//      }


      var game = this.game;
      var boundsGfx = this.add.graphics(game.world.centerX, game.world.centerY); 

      // Draw the play boundry.
      boundsGfx.lineStyle(5, 0xCCCCCC);
      boundsGfx.drawCircle(0, 0, 300);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);

    },
    update: function() {

    },
    createStar: function(){
    
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;