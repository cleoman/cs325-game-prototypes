"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
        game.load.image( 'grasstile', 'assets/grass1.jpg' );
        game.load.spritesheet( 'mage', 'assets/mage.png', 16, 16 );

    }

    var bouncy;

    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        // bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // // Anchor the sprite at its center, as opposed to its top-left corner.
        // // so it will be truly centered.
        // bouncy.anchor.setTo( 0.5, 0.5 );
        //
        // // Turn on the arcade physics engine for this sprite.
        // game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // // Make it bounce off of the world bounds.
        // bouncy.body.collideWorldBounds = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        // var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        // var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        // text.anchor.setTo( 0.5, 0.0 );

        let tileSprite = game.add.tileSprite(0, 0, 800, 600, 'grasstile');
        this.pc = game.add.sprite(game.width /2, game.height /2, 'mage');
        this.game.physics.arcade.enable(this.pc);
        this.pc.scale.setTo(2,2);
        this.pc.goingUp = false;
        this.pc.goingDown = false;
        this.pc.goingLeft = false;
        this.pc.goingRight = false;
        this.pc.idleFrame = 0;

        let moveDown = this.pc.animations.add("moveDown", [0, 1, 2, 3]);
        let moveUp = this.pc.animations.add("moveUp", [4, 5, 6, 7]);
        let moveRight = this.pc.animations.add("moveRight", [8,9,10,11]);
        let moveLeft = this.pc.animations.add("moveLeft", [12,13,14,15]);

        let upKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.W);
        let downKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.S);
        let leftKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.A);
        let rightKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.D);

        upKeyPressed.onDown.add(function() {
          this.pc.goingUp = true;
        }, this);
        upKeyPressed.onUp.add(function() {
          this.pc.goingUp = false;
        }, this);
        downKeyPressed.onDown.add(function() {
          this.pc.goingDown = true;
        }, this);
        downKeyPressed.onUp.add(function() {
          this.pc.goingDown = false;
        }, this);
        leftKeyPressed.onDown.add(function() {
          this.pc.goingLeft = true;
        }, this);
        leftKeyPressed.onUp.add(function() {
          this.pc.goingLeft = false;
        }, this);
        rightKeyPressed.onDown.add(function() {
          this.pc.goingRight = true;
        }, this);
        rightKeyPressed.onUp.add(function() {
          this.pc.goingRight = false;
        }, this);

    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        if(this.pc.goingRight){
          this.pc.animations.play("moveRight", 10, true);
          this.pc.idleFrame = 8;
          this.pc.body.velocity.x = 100;
        }
        else if(this.pc.goingLeft){
          this.pc.animations.play("moveLeft", 10, true);
          this.pc.idleFrame = 12;
          this.pc.body.velocity.x = -100;
        }
        else if(this.pc.goingUp){
          this.pc.animations.play("moveUp", 10, true);
          this.pc.idleFrame = 4;
          this.pc.body.velocity.y = -100;
        }
        else if(this.pc.goingDown){
          this.pc.animations.play("moveDown", 10, true);
          this.pc.idleFrame = 0;
          this.pc.body.velocity.y = 100;
        }
        else {
          this.pc.frame = this.pc.idleFrame;
          this.pc.body.velocity.x = 0;
          this.pc.body.velocity.y = 0;
        }
    }
};
