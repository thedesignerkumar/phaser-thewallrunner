Game.Start = function (game) {
    "use strict";
    this.background;
    this.platforms;
    this.player;
    this.rocks;
    this.pickUpItems;
    this.scoreText;
    this.score = 0;
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

        // add scores
        this.addScores();

    },

    update: function () {
        "use strict";

        this.physics.arcade.collide(this.player, this.platforms);
        this.physics.arcade.collide(this.enemies, this.platforms);
        this.physics.arcade.collide(this.player, this.enemies, this.enemyKill, null, this);
        this.physics.arcade.overlap(this.player, this.pickUpItems, this.collectItems, null, this);

        this.background.tilePosition.x = -this.camera.x;

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

    buildPlayer: function () {
        this.player = this.add.sprite(32, this.world.height - 160, 'player', 0);
        this.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.1;
        this.player.body.gravity.y = 300;
        this.player.checkWorldBounds = true;
        this.player.outOfBoundsKill = true;
        this.player.animations.add('walk', [2, 3, 4, 5, 6, 7], 8, true);
        this.player.body.velocity.x = 100;
        this.player.animations.play('walk');
        this.camera.follow(this.player);
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.input.onDown.add(this.jump, this);
    },

    jump: function () {
        if (this.player.body.touching.down) {
            this.player.body.velocity.y = -250;
        }
    },

    buildEnemies: function () {
        this.enemies = this.add.group();
        for (var i = 0; i < 5; i++) {
            var enemy = this.enemies.create(this.rnd.integerInRange(150, 4800), this.world.height - (this.cache.getImage('ground').height) * 0.518, 'enemy');
            this.physics.arcade.enable(enemy);
            enemy.body.immovable = true;
        }
    },

    buildPickup: function () {
        this.pickUpItems = this.add.group();
        this.pickUpItems.enableBody = true;
        for (var i = 0; i < 5; i++) {
            var pickup = this.pickUpItems.create(this.rnd.integerInRange(150, 4800), this.rnd.integerInRange(400, 500), 'item');
            pickup.body.immovable = true;
        }
    },

    collectItems: function (player, pickUpItems) {
        pickUpItems.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;

    },

    enemyKill: function (player, enemies) {
        player.body.velocity.x = 0;
        player.animations.stop('walk', false);
        player.animations.frame = 1;
    },

    addScores: function () {
        this.scoreText = this.add.text(10, 10, 'Score: 0');
        this.scoreText.fixedToCamera = true;
    },

}