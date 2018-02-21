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
        // game.load.image( 'chickenbg', 'assets/chickenbg.png');
        // game.load.image( 'egg', 'assets/egg.png' );
        // game.load.audio( 'chickenmusic', 'assets/chicken.mp3');
        // game.load.image( 'goldenegg', 'assets/goldenegg.png' );'
        game.load.image( 'spacebg', 'assets/space_BG.png' );
        game.load.image( 'spaceUIBG', 'assets/space_UIbg.png');
        game.load.image( 'spaceUI', 'assets/space_UIstuff.png');

    }

    let pc;
    let grass;
    let score = 1;
    let eggs = 0;
    let price = 5;
    let chickentext;
    let eggtext;
    let buytext;
    let directionstext;
    let ding;
    let timer;
    let music;

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

        // // physics go
        // game.physics.startSystem(Phaser.Physics.ARCADE);
        //

        // // dirt bg
        // let tileSprite = game.add.tileSprite(0, 0, 800, 600, 'chickenbg');
        //
        let bgSprite = game.add.tileSprite(0, 0, 800, 600, 'spacebg');
        let uibgSprite = game.add.tileSprite(0, 0, 800, 600, 'spaceUIBG');
        let uistuffSprite = game.add.tileSprite(0, 0, 800, 600, 'spaceUI');
        // // music
        // ding = game.add.audio('chickenmusic');
        // ding.volume = 0.3;
        // ding.play();


        // score display
        // chickentext = game.add.text(5,60, "Chickens: " + score, {
        //   font: "32px Arial",
        //   fill: "#000000",
        //   align: "center"
        // });
        //
        // eggtext = game.add.text(5, 90, "Eggs: " + eggs, {
        //   font: "32px Arial",
        //   fill: "#000000",
        //   align: "center"
        // });
        //
        // buytext = game.add.text(5,180, "Buy Chicken (" + price + " eggs)", {
        //   font: "18px Arial",
        //   fill: "#f4f000",
        //   align: "center"
        // });
        //
        // directionstext = game.add.text(25, 460, "Find (and click) the golden egg\nMore likely to spawn the more\nChickens you have", {
        //   font: "11px Arial",
        //   fill: "#000000",
        //   align: "center"
        // });

        // setup buy click event
        // buytext.inputEnabled = true;
        // buytext.events.onInputDown.add(doBuy, this);
        // buytext.events.onInputOver.add(function() {
        //   buytext.fill = "#f00000";
        // }, this);
        // buytext.events.onInputOut.add(function() {
        //   buytext.fill = "#f4f000";
        // })

        // timer
        // timer = game.time.create(false);
        // timer.loop(1000, tick, this);
        // timer.start();

        // keyboard triggers
        // let upKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.W);
        // let downKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.S);
        // let leftKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.A);
        // let rightKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.D);
        // let actionKeyPressed = game.input.keyboard.addKey(Phaser.Keyboard.E);




    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
        // chickentext.text = "Chickens: " + score;
        // eggtext.text = "Eggs: " + eggs;
    }




};
