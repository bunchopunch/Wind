'use strict';
function Menu() {}

Menu.prototype = {
  ship: null,
  uiLayer: null,
  create: function() {
    var i = 0;

    // Create a layer for the Background
    this.backgroundLayer = this.game.add.group();

    this.background = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, this.game.stage.bounds.height, 'background');
    this.backgroundLayer.add(this.background);

    // Create the nebula
    for (i = 0; i < 8; i++) {
      this.backgroundLayer.add(this.createNebula());
    }

    // Text styles
    var headerStyle = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    var subheaderStyle = { font: '24px Arial', fill: '#ffffff', align: 'center'};
    var buttonStyle = { font: '35px Arial', fill: '#ffffff', align: 'center', cursor: 'pointer'};

    // Build the main UI elements
    this.logo = this.game.add.sprite(this.game.world.centerX, 265, 'logo');
    this.instructionsText = this.game.add.text(this.game.world.centerX, 365, 'Find the planet. Dodge the stars.', subheaderStyle);
    this.startButton = this.game.add.button(this.game.world.centerX, 450, 'button', this.startButton, this);
    this.buttonText = this.game.add.text(this.game.world.centerX, 450, 'START', buttonStyle);

    this.logo.anchor.setTo(0.5, 0.5);
    this.instructionsText.anchor.setTo(0.5, 0.5);
    this.startButton.anchor.setTo(0.5, 0.5);
    this.buttonText.anchor.setTo(0.5, 0.5);

    // Create a layer for the UI
    this.uiLayer = this.game.add.group();
    this.uiLayer.add(this.logo);
    this.uiLayer.add(this.instructionsText);
    this.uiLayer.add(this.startButton);
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
    newNebula.alpha = 0.3;
    newNebula.body.enable;
    newNebula.body.angularVelocity = this.game.rnd.integerInRange(-2, 2);

    return newNebula;
  }
};

module.exports = Menu;
