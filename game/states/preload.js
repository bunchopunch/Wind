
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('logo', 'assets/logo.png');
    this.load.image('star14', 'assets/star-14.png');
    this.load.image('star32', 'assets/star-32.png');
    this.load.image('star64', 'assets/star-64.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('goal', 'assets/earth-64.png');
    this.load.image('button', 'assets/button.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('nebula1', 'assets/nebula1.png');
    this.load.image('nebula2', 'assets/nebula2.png');
    this.load.image('nebula3', 'assets/nebula3.png');
    this.load.image('win', 'assets/win.png');
    this.load.image('lose', 'assets/lose.png');
    this.load.image('gameover', 'assets/gameover.png');    
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
