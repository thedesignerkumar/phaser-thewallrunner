Game.Start = function (game) {
    "use strict";
    this.playing = false;
    this.background;
    this.platforms;
    this.player;
    this.rocks;
    this.pickUpItems;
    this.gameOverMessage;
    this.startButton;
    this.timer;
    this.unableJumpMessage;
    this.winText;
};

Game.Start.prototype = {

    create: function () {
        "use strict";

        // load physics arcade
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.setBounds(0, 0, 5000, 600);

        // load world
        this.buildWorld();

        // add player
        this.buildPlayer();

        // add obstructions
        this.buildEnemies();

        // add pickup items
        this.buildPickup();

        // TODO: Need to add moving enemies, clouds, birds and mega energy item

        // add scores
        this.addScores();

        // add start button
        this.startButton = this.add.button(400, 300, 'button', this.startGame, this, 1, 0, 2);
        this.startButton.anchor.set(0.5);
        this.startButton.useHandCursor = true;

        // add timer
        this.timer = this.time.create(false);

        // updateEnergy to update every 3 seconds
        this.timer.add(500, this.updateEnergy, this);




    },

    update: function () {
        "use strict";

        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.collide(this.player, this.enemies, this.killPlayer, null, this);
        this.physics.arcade.overlap(this.player, this.pickUpItems, this.collectItems, null, this);

        this.background.tilePosition.x = -this.camera.x;

        if (this.player.x >= 4900) {
            this.win();
        }

        if (Game.energy >= 100) {
            Game.energy = 100;
        } else if (Game.energy <= 0) {
            Game.energy = 0;
        }
        Game.energyText.text = 'Energy: ' + Game.energy;
        if (Game.life <= 0) {
            Game.life = 0;
        }
        Game.lifeText.text = 'Life: ' + Game.life;
        Game.scoreText.text = 'Score: ' + Game.score;
    },

    buildWorld: function () {
        // load background
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.background.fixedToCamera = true;

        // add ground
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        this.addGround();

    },

    addGround: function () {
        var ground;

        for (var i = 0; i < 7; i++) {
            var hole = this.cache.getImage('ground').width;
            ground = this.platforms.create((hole + this.rnd.integerInRange(65, 90)) * i, this.world.height - 50, 'ground');
            ground.scale.y = 0.4;
            ground.body.immovable = true;
        }
    },

    addGroundBlocks: function () {
        this.platforms.forEach(function (ground) {
            var minimumDist = 250;
            console.log(ground.x, ground.height);
            startPosition = ground.x + minimumDist;
            endPosition = ground.x + ground.width + minimumDist;
            this.groundBlocks = this.add.sprite(this.rnd.integerInRange(startPosition, endPosition), this.world.height - (ground.height + 22), 'enemy');
            this.groundBlocks.enableBody = true;
        }, this)
    },

    buildPlayer: function () {
        this.player = this.add.sprite(32, this.world.height - 160, 'player', 0);
        this.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.1;
        this.player.body.gravity.y = 300;
        this.player.checkWorldBounds = true;
        this.player.events.onOutOfBounds.add(this.killPlayer, this);
        this.player.animations.add('walk', [2, 3, 4, 5, 6, 7], 8, true);
        this.player.body.velocity.x = 0;
        this.camera.follow(this.player);
        this.input.onDown.add(this.jump, this);
    },

    jump: function () {
        if (this.player.body.touching.down && this.playing && this.player.x <= 4600) {
            if (Game.energy >= 10) {
                this.player.body.velocity.y = -250;
                Game.energy -= 5;
            } else {
                this.showUnableJump();
            }

        }
    },

    showUnableJump: function () {
        if (this.unableJumpMessage) {
            this.unableJumpMessage.destroy();
        }
        this.unableJumpMessage = this.add.bitmapText(this.player.x, this.player.y - 100, 'toontime', 'Engery low!!', 24);
    },

    buildEnemies: function () {
        // TODO: Need to fix the placement of the enemies
        this.enemies = this.add.group();
        var startPosition = 150;
        for (var i = 0; i < 8; i++) {
            var enemy = this.enemies.create(this.rnd.integerInRange(startPosition, 4800), this.world.height - (this.cache.getImage('ground').height) * 0.518, 'enemy');
            this.physics.arcade.enable(enemy);
            enemy.body.immovable = true;
            startPosition += 200;
        }
    },

    buildPickup: function () {
        // TODO: Need to fix the placement of food items
        this.pickUpItems = this.add.group();
        this.pickUpItems.enableBody = true;
        for (var i = 0; i < 25; i++) {
            var pickup = this.pickUpItems.create(this.rnd.integerInRange(150, 4800), this.rnd.integerInRange(400, 500), 'item');
            pickup.body.immovable = true;
        }
    },

    collectItems: function (player, pickUpItems) {
        pickUpItems.kill();
        Game.score += 100;
        Game.energy += 5;
    },

    startGame: function () {
        this.startButton.destroy();
        this.player.body.velocity.x = 100;
        this.player.animations.play('walk');
        this.playing = true;
        this.timer.start();
    },

    killPlayer: function (player, enemies) {
        player.body.velocity.x = 0;
        player.animations.stop('walk', false);
        player.animations.frame = 1;
        this.playing = false;
        Game.life -= 1;
        this.timer.stop();
        this.gameOverMessage = this.add.bitmapText(120, 200, 'toontime', "Game Over\nTap to start again", 56);
        this.gameOverMessage.align = 'center';
        this.gameOverMessage.fixedToCamera = true;
        this.gameOverMessage.inputEnabled = true;
        this.gameOverMessage.input.useHandCursor = true;
        this.gameOverMessage.events.onInputDown.addOnce(this.quitGame, this);
    },

    quitGame: function () {
        if (Game.life > 0) {
            Game.energy = 100;
            this.state.start('Start');
        } else {
            Game.life = 3;
            Game.score = 0;
            Game.energy = 100;
            this.state.start('Menu');
        }
    },

    addScores: function () {
        Game.scoreText = this.add.text(10, 10, 'Score: ' + Game.score);
        Game.lifeText = this.add.text(700, 10, 'Life: ' + Game.life);
        Game.energyText = this.add.text(320, 10, 'Energy: ' + Game.energy);
        Game.scoreText.fixedToCamera = true;
        Game.lifeText.fixedToCamera = true;
        Game.energyText.fixedToCamera = true;
    },

    updateEnergy: function () {
        if (Game.energy <= 1) {
            this.killPlayer(this.player);
            this.overMessage = this.add.bitmapText(250, 450, 'toontime', "You ran out of energy", 24);
            this.overMessage.fixedToCamera = true;
            this.timer.stop();
        } else {
            Game.energy -= 1;
            this.timer.add(500, this.updateEnergy, this);

        }
    },

    win: function () {
        this.player.body.velocity.x = 0;
        this.player.animations.stop('walk', false);
        this.winText = this.add.bitmapText(250, 250, 'toontime', "Great!!\nYou won!!", 56)
        this.winText.align = 'center';
        this.winText.fixedToCamera = true;
        this.timer.stop();
    }

}
