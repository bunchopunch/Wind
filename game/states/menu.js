'use strict';
function Menu() {}

Menu.prototype = {
  ship: null,
  uiLayer: null,
  create: function() {
    var game = this.game;

    // Create a layer for the Background
    this.backgroundLayer = this.game.add.group();

    this.background = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.stage.bounds.height, "background");
    this.backgroundLayer.add(this.background);

    // Create the nebula
    for (var i = 0; i < 8; i++) {
      this.backgroundLayer.add(this.createNebula());
    };

    // Text styles
    var titleStyle = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    var helpStyle = { font: '24px Arial', fill: '#ffffff', align: 'center'};
    var buttonStyle = { font: '35px Arial', fill: '#ffffff', align: 'center', cursor: 'pointer'};

    // Build the main UI elements
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'A Wind to Shake the Stars', titleStyle);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.instructionsText = this.game.add.text(this.game.world.centerX, 395, 'Find the planet. Dodge the stars.', helpStyle);
    this.instructionsText.anchor.setTo(0.5, 0.5);
    this.button = this.game.add.button(this.game.world.centerX - 198, 450, 'button', this.startButton, this);
    this.buttonText = this.game.add.text(this.game.world.centerX - 60, 485, 'START', buttonStyle);

    // Create a layer for the UI
    this.uiLayer = this.game.add.group();
    this.uiLayer.add(this.titleText);
    this.uiLayer.add(this.instructionsText);
    this.uiLayer.add(this.button);
    this.uiLayer.add(this.buttonText);

    // create the ship
    this.ship = this.game.add.sprite(-45, 500, 'ship');
    this.ship.anchor.setTo(0.5, 0.5);

  },

  startButton: function () {
    var menuOutro = this.game.add.tween(this.uiLayer).to({alpha: 0}, 1000, Phaser.Easing.Linear.NONE, false);
    var shipOutro = this.game.add.tween(this.ship).to({x: 1030}, 1000, Phaser.Easing.Linear.NONE, false);
    var backgroundOutro = this.game.add.tween(this.backgroundLayer).to({alpha: 0}, 1000, Phaser.Easing.Linear.NONE, false);
    var startGame = function() {
      this.game.state.start('play');
    };

    // Chain the tweens we just set up
    menuOutro.chain(shipOutro);
    shipOutro.chain(backgroundOutro);
    menuOutro.start();

    backgroundOutro.onComplete.add(startGame, this);
  },

  update: function() {
    this.background.tilePosition.x -= 0.5;
  },

  createNebula: function(){
    var newNebula = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'nebula' + this.game.rnd.integerInRange(1, 3));
    this.game.physics.enable(newNebula, Phaser.Physics.ARCADE);
    newNebula.alpha = 0.5;
    newNebula.body.enable;
    newNebula.body.angularVelocity = this.game.rnd.integerInRange(-2, 2);

    return newNebula;
  }
};

module.exports = Menu;
