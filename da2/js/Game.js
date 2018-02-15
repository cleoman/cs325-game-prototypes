"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
    var player = null;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

    return {

        create: function () {

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.stage.backgroundColor = "#a9f0ff";



            this.map = this.game.add.tilemap('tilemap');
            this.map.addTilesetImage('chickengame', 'chickentiles')

            this.backgroundlayer = this.map.createLayer('BackgroundLayer');
            this.groundlayer = this.map.createLayer('GroundLayer');
            this.grasslayer = this.map.createLayer('GrassLayer');
            this.objectlayer = this.map.createLayer('ObjectNoCLayer');
            this.map.setCollisionBetween(1, 100, true, 'GroundLayer');

            this.groundlayer.resizeWorld();

            game.camera.x = 0;
            game.camera.y = (game.world.centerY) + 450;

            game.physics.arcade.gravity.y = 250;

            player = game.add.sprite(16, 16, 'chicken');
            player.frame = 0;
            game.physics.enable(player);

            player.body.bounce.y = 0.2;
            player.body.collideWorldBounds = true;
            // player.body.setSize()

            game.camera.follow(player);

            this.cursors = this.game.input.keyboard.createCursorKeys();


        },

        update: function () {

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
            this.game.physics.arcade.collide(player, this.groundlayer);
            player.body.velocity.x = 0;

            if(this.cursors.right.isDown) {
              player.body.velocity.x = 10;
              player.frame = 0;
            }
            else if (this.cursors.left.isDown) {
              player.body.velocity.x = -10;
              player.frame = 1;
            }
        }
    };
};
