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

    var game = new Phaser.Game( 1000, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload()
    {
        game.load.image('smash', 'assets/smash.png');
        game.load.image('slash', 'assets/slash.png');
        game.load.image('block', 'assets/block.png');
        game.load.image('hunker_down', 'assets/hunker_down.png');

        game.load.image('screen', 'assets/rpgscreen.png');

        game.load.audio('ding', 'assets/dingCling-positive.ogg');
        game.load.audio('bgm', 'assets/bgm.mp3');
    }

    function card(name, img, dmgrange, flatdmg, blockrange, flatblock, ap)
    {
        this.name = name; // want a string
        this.img = img; // want a string
        this.dmgrange = dmgrange; // reference dice rolls like 1d6, we'll use 6 as the range
        this.flatdmg = flatdmg; // just want an integer 
        this.blockrange = blockrange; // refer to dmg range
        this.flatblock = flatblock; // an integer
        this.ap = ap; // ap cost integer
    }

    let deck = new Array();
    let discard = new Array();


    function create()
    {
        console.log("am here");
        let bgscreen = game.add.sprite(0,0, "screen");
        


        for(let i = 0;i < 5;i++)
        {
            console.log("here");
            // Generate five smash
            let temp = new card("Smash", "smash", 6, 2, 0, 0, 1);
            deck.push(temp);

        }
    
        for(let i = 5;i < 10;i++)
        {
            // Five Slash
            let temp = new card("Slash","slash",12,3,0,0,2);
            deck.push(temp);
        }
    
        for(let i = 10; i < 15;i++)
        {
            // Five Block
            let temp = new card("Block","block",0,0,6,1,1);
            deck.push(temp);
        }
    
        for(let i = 15;i < 20;i++)
        {
            // Five Hunker Down
            let temp = new card("Hunker Down", "hunker_down",0,0,12,2,2);
            deck.push(temp);
        }

        for(let i = 0; i < 20; i++)
        {
            deck[i].obj = game.add.sprite(0, 0, deck[i].img);
            deck[i].obj.visible = false;
        }

        console.log(deck);
        shuffleDeck(deck);
        drawCards();

    }



    function update()
    {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

       



    }


    // deck shuffle function gleefully stolen from
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    // fisher yates shuffle
    function shuffleDeck(array)
    {
        
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
    
            // Decrease counter by 1
            counter--;
    
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    
        return array;
    }
  
    function drawCards()
    {
        let hand = new Array();
        let xsp = 220;
        for(let i = 0; i < 4; i++)
        {
            hand.push(deck.pop());
        }
        for(let i = 0; i < 4; i++)
        {
            hand[i].obj.visible = true;
        }
        console.log(hand);
        hand[0].obj.x = 60;
        hand[0].obj.y = 430;
        hand[1].obj.x = hand[0].obj.x + xsp;
        hand[1].obj.y = hand[0].obj.y;
        hand[2].obj.x = hand[1].obj.x + xsp;
        hand[2].obj.y = hand[0].obj.y;
        hand[3].obj.x = hand[2].obj.x + xsp;
        hand[3].obj.y = hand[0].obj.y;
    }

};
