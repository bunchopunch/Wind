(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var config = {
    width: 1000,
    height: 700
  };

  var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'stars');

  game.uiState = {
    lives: 3,
    multiplier: 1,
    level: 1,
    score: 0
  };

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){
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
//    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'A Wind to Shake the Stars', headerStyle);
//    this.titleText.anchor.setTo(0.5, 0.5);
    this.logo = this.game.add.sprite(this.game.world.centerX, 300, 'logo');
    this.instructionsText = this.game.add.text(this.game.world.centerX, 410, 'Find the planet. Dodge the stars.', subheaderStyle);
    this.button = this.game.add.button(this.game.world.centerX - 198, 450, 'button', this.startButton, this);
    this.buttonText = this.game.add.text(this.game.world.centerX - 60, 485, 'START', buttonStyle);

    this.logo.anchor.setTo(0.5, 0.5);
    this.instructionsText.anchor.setTo(0.5, 0.5);

    // Create a layer for the UI
    this.uiLayer = this.game.add.group();
    this.uiLayer.add(this.logo);
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
    newNebula.alpha = 0.3;
    newNebula.body.enable;
    newNebula.body.angularVelocity = this.game.rnd.integerInRange(-2, 2);

    return newNebula;
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){
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
      this.stateText = this.game.add.sprite(this.game.world.centerX, 300, 'loose');
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

},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
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
    this.load.image('loose', 'assets/loose.png');
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

},{}]},{},[1])