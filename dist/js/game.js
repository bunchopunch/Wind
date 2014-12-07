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
    this.load.image('earth', 'assets/earth.png');
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