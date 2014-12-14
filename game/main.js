'use strict';

//global variables
window.onload = function () {
  var config = {
    width: 1000,
    height: 700
  };

  var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'stars');

  game.uiState = {
    menu: true,
    lives: 3,
    multiplier: 1,
    level: 1,
    score: 0
  };

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};