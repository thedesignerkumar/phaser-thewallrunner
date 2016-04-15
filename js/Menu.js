Game.Menu = function (game) {
    "use strict";
    this.startBG;
    this.startPrompt;
};

Game.Menu.prototype = {

    create: function () {

        startBG = this.add.image(0, 0, 'menuscreen');
        startBG.inputEnabled = true;
        startBG.events.onInputDown.addOnce(this.startGame, this);

        startPrompt = this.add.bitmapText(this.world.centerX-180, this.world.centerY + 180, 'toontime', 'Touch To Start', 46);
    },

    startGame: function () {
        this.state.start('Start');
    }

}