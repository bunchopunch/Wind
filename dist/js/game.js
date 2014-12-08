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
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'ship');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'A Wind to Shake the Stars', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Find the planet. Dodge the stars.', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);



    var button = this.game.add.button(this.game.world.centerX - 198, 450, 'button', this.startButton);
    this.titleText = this.game.add.text(this.game.world.centerX - 60, 485, 'START', { font: '35px Arial', fill: '#ffffff', align: 'center', cursor: 'pointer'});
  },

  startButton: function () {
    this.game.state.start('play');
  },
//  update: function() {
//    if(this.game.input.activePointer.justPressed()) {
//    }
//  }
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
    playerCursorKeys: null,
    starLayer: null,
    goalLayer: null,
    player: null,
    goal: null,
    create: function() {
      var game = this.game;
      var difficulty = [5, 3, 1];
      console.log(game.uiState);

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
      for (var i = 0; i < (difficulty[0] * this.multiplier() ); i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'small'));
      };
      for (var i = 0; i < difficulty[1] * this.multiplier() ; i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'medium'));
      };
      for (var i = 0; i < difficulty[2] * this.multiplier() ; i++) {
        this.starLayer.add(this.createStar(this.rndLayerPos('x'), this.rndLayerPos('y'), 'large'));
      };

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
      if (this.game.uiState.lives <= 0){
        this.titleText = this.game.add.text(this.game.world.centerX - 250, 300, 'GAME OVERED', style);
        this.titleText = this.game.add.text(this.game.world.centerX, 400, 'YOUR SCORE: ' + this.game.uiState.score, { font: '16px Arial', fill: '#ffffff', align: 'center'});
        this.titleText.anchor.setTo(0.5, 0.5);
        this.player.body.angularVelocity = 100;
      } else {
        this.titleText = this.game.add.text(this.game.world.centerX, 300, 'DEADED', style);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.game.uiState.lives--;

        this.timer = this.game.time.create(this.game);
        this.timer.add(3000, this.game.state.start('play'), this);
        this.timer.start();
      }
    },

    winHandler: function(){
      var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
      this.titleText = this.game.add.text(this.game.world.centerX, 300, 'WINNED', style);
      this.titleText.anchor.setTo(0.5, 0.5);
      this.game.uiState.multiplier++;
      this.game.uiState.score += 1000;
      this.game.state.start('play');
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
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('star14', 'assets/star-14.png');
    this.load.image('star32', 'assets/star-32.png');
    this.load.image('star64', 'assets/star-64.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('goal', 'assets/earth-64.png');
    this.load.image('button', 'assets/button.png');
    this.load.image('background', 'assets/background.png');
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