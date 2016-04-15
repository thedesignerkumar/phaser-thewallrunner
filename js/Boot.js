
var Game = {};

Game.Boot = function (game) {
    "use strict";
};

Game.Boot.prototype = {

    preload: function () {
        "use strict";
        this.load.image('preloaderBack', 'images/preloadback.png');
        this.load.image('preloaderBar', 'images/preloader.png');
        this.load.image('titleText', 'images/titletext.png');
    },

    create: function () {
        "use strict";
        this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;
		this.scale.minWidth = 600;
		this.scale.minHeight = 450;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
//        this.scale.setScreenSize(true);
		this.stage.forceLandscape = true;

		this.input.addPointer();
		this.stage.backgroundColor = '#3d0411';

		this.state.start('Preloader');
    }
};