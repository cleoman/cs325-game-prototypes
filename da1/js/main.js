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
        game.load.image( 'dirttile', 'assets/dirt1.jpg' );
        game.load.spritesheet( 'mage', 'assets/mage.png', 16, 16 );
        game.load.image( 'grass', 'assets/grass1.jpg' );
        game.load.audio( 'ding', 'assets/dingCling-positive.ogg');

    }

    var bouncy;
    let pc;
    let grass;
    let score = 0;
    let text;
    let ding;

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



        // dirt bg
        let tileSprite = game.add.tileSprite(0, 0, 800, 600, 'dirttile');

        // sounds
        ding = game.add.audio('ding');

        // create the "grass" or diggable tiles
        grass = game.add.group();
        grass.createMultiple(450, 'grass',0,true);
        grass.align(25, 19, 32, 32);
        grass.x = 0;
        grass.y = 0;
        console.log(grass);

        // create the player character
        pc = game.add.sprite(game.width /2, game.height /2, 'mage');
        this.game.physics.arcade.enable(pc);
        pc.body.collideWorldBounds = true;
        pc.scale.setTo(2,2);
        pc.goingUp = false;
        pc.goingDown = false;
        pc.goingLeft = false;
        pc.goingRight = false;
        pc.doAction = false;
        pc.actionJustDone = false;
        pc.idleFrame = 0;

        // define player character animations
        let moveDown = pc.animations.add("moveDown", [0, 1, 2, 3]);
        let moveUp = pc.animations.add("moveUp", [4, 5, 6, 7]);
        let moveRight = pc.animations.add("moveRight", [8,9,10,11]);
        let moveLeft = pc.animations.add("moveLeft", [12,13,14,15]);

        // score display
        text = game.add.text(0,0, "Score: " + score, {
          font: "32px Arial",
          fill: "#f4f000",
          align: "center"
        });

        let directions = game.add.text(0,40, "WASD to move\nE to dig", {
          font: "12px Arial",
          fill: "#f4f000",
          align: "center"
        });



        // keyboard triggers
        let upKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.W);
        let downKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.S);
        let leftKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.A);
        let rightKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.D);
        let actionKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.E);

        // handle keyboard triggers
        upKeyPressed.onDown.add(function() {
          pc.goingUp = true;
        }, this);
        upKeyPressed.onUp.add(function() {
          pc.goingUp = false;
        }, this);
        downKeyPressed.onDown.add(function() {
          pc.goingDown = true;
        }, this);
        downKeyPressed.onUp.add(function() {
          pc.goingDown = false;
        }, this);
        leftKeyPressed.onDown.add(function() {
          pc.goingLeft = true;
        }, this);
        leftKeyPressed.onUp.add(function() {
          pc.goingLeft = false;
        }, this);
        rightKeyPressed.onDown.add(function() {
          pc.goingRight = true;
        }, this);
        rightKeyPressed.onUp.add(function() {
          pc.goingRight = false;
        }, this);
        actionKeyPressed.onDown.add(function() {
          pc.doAction = true;

          console.log("PRESSED A BUTTON");
        }, this);
        actionKeyPressed.onUp.add(function() {
          pc.doAction = false;
          pc.actionJustDone = false;
        })



    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        if(pc.doAction && !pc.actionJustDone ){
          console.log("AM HERE");
          playerAction();
        }
        if(pc.goingRight){
          pc.animations.play("moveRight", 10, true);
          pc.idleFrame = 8;
          pc.body.velocity.x = 200;
          pc.body.velocity.y = 0;
        }
        else if(pc.goingLeft){
          pc.animations.play("moveLeft", 10, true);
          pc.idleFrame = 12;
          pc.body.velocity.x = -200;
          pc.body.velocity.y = 0;
        }
        else if(pc.goingUp){
          pc.animations.play("moveUp", 10, true);
          pc.idleFrame = 4;
          pc.body.velocity.y = -200;
          pc.body.velocity.x = 0;
        }
        else if(pc.goingDown){
          pc.animations.play("moveDown", 10, true);
          pc.idleFrame = 0;
          pc.body.velocity.y = 200;
          pc.body.velocity.x = 0;
        }
        else {
          pc.frame = pc.idleFrame;
          pc.body.velocity.x = 0;
          pc.body.velocity.y = 0;
        }
    }

    function playerAction() {
        let closestTile = grass.getClosestTo(pc);
        console.log(closestTile);
        if(closestTile.visible === true){
          closestTile.visible = false;
          score++;
          text.setText("Score: " + score);
          ding.play();
          pc.actionJustDone = true;
        }

    }
};
