(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var config = {
    width: 1000,
    height: 700
  }
  var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'watergame');

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
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'NOT a WaterGame', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    playerCursorKeys: null,
    starLayer: null,
    goalLayer: null,
    player: null,
    goal: null,
    create: function() {
      var game = this.game;
      var levels = [
          [5, 3, 1, 200],
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
        this.starLayer.add(this.createStar(game.world.randomX, this.randomPostion('y'), 'small'));
      };
      for (var i = 0; i < levels[currentLevel - 1][2 - 1]; i++) {
        this.starLayer.add(this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'medium'));
      };
      for (var i = 0; i < levels[currentLevel - 1][3 - 1]; i++) {
        this.starLayer.add(this.createStar(this.randomPostion('x'), this.randomPostion('y'), 'large'));
      };

      // Create a goal object
      this.goalLayer.add(this.goal = this.createGoal(levels[currentLevel - 1][3]));

      // Create the player ship
      this.player = this.createPlayer( this.game.world.centerX, this.game.world.centerY );
    },

    deathHandler: function(){
      console.log("Deaded")
    },

    winHandler: function(){
      console.log("A winner is you!");
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

      this.game.camera.focusOnXY(this.player.x, this.player.y + this.player.height - this.camera.view.halfHeight);

    },

    randomInRange: function(min, max){
      var returning = Math.floor(Math.random() * (min - max)) + min;
      return returning; 
    },

    randomPostion: function(axis){
      if (axis === 'x') {
        return this.game.world.randomX - this.game.world.width
      } else {
        var hay = this.game.world.randomY;
        return hay - this.game.world.height/2
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
      var newGoal = this.game.add.sprite(this.randomPostion('x'), this.randomPostion('y'), 'goal');
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