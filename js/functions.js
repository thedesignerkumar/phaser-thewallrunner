addGround: function () {
    var ground;
    var hole = 850;
    for (var i = 0; i < 7, i++) {
        if (i == 0) {
            ground = this.platforms.create(0, this.world.height - 50, 'ground');
        } else {
            ground = this.platforms.create(hole, this.world.height - 50, 'ground');
            hole += 850;
        }
        ground.scale.setTo(0.4, 0.4);
        ground.body.immovable = true;
    }
}

 var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 80; i++) {
            if (i != hole && i != hole + 1) {
                var ground = this.platforms.create(i * 60, this.world.height - 50, 'ground');
                ground.scale.setTo(0.4, 0.4);
                ground.body.immovable = true;
            }
        }

var ground;
        var hole = this.cache.getImage('ground').width;
        for (var i = 0; i < 8; i++) {
            if (i == 0) {
                ground = this.platforms.create(0, this.world.height - 50, 'ground');
                hole += 50;
            } else {
                ground = this.platforms.create(hole, this.world.height - 50, 'ground');
                hole += 50;
            }
            ground.scale.setTo(0.4, 0.4);
            ground.body.immovable = true;
        }