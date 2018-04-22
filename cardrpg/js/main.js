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
        game.load.image('playerwon', 'assets/playerwon.png');
        game.load.image('enemywon', 'assets/enemywon.png');


        game.load.image('instructions', 'assets/instructions.png');
        game.load.image('screen', 'assets/rpgscreen.png');

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

    function Player(name,maxhp,maxap)
    {
        this.maxhp = maxhp;
        this.hp = maxhp;
        this.maxap = maxap;
        this.ap = maxap;
        this.name = name;
        this.block = 0;
        this.dmg = 0;
    }

    function Enemy(name,maxhp)
    {
        this.name = name;
        this.maxhp = maxhp;
        this.hp = maxhp;
        this.block = 0;
        this.dmg = 0;
    }

    let deck = new Array();
    let discard = new Array();
    let hand = new Array();
    let pc = new Player("Monty", 45, 3);
    let ec = new Enemy("Bad Guy", 30);
    let hpText;
    let apText;
    let enemyHpText;
    let endTurnText;

    function create()
    {
        console.log("am here");
        let bgscreen = game.add.sprite(0,0, "screen");
        let hpStyle = { font: "26pt Comic Sans", fill: "yellow", align: "left" };
        let dmgStyle = { font: "14pt Comic Sans", fill: "white", align: "left" };
        let etStyle = { font: "38pt Arial", fill: "red", align: "left"}
        pc.hpText = game.add.text( 150, 10, "" + pc.hp + "/" + pc.maxhp + "hp", hpStyle);
        pc.apText = game.add.text( 300, 380, "AP: " + pc.ap, hpStyle);
        ec.hpText = game.add.text( 775, 10, "" + ec.hp + "/" + ec.maxhp + "hp", hpStyle);

        pc.dmgText = game.add.text( 350, 10, "Player doing "+pc.dmg+" dmg", dmgStyle);
        pc.blocktext = game.add.text( 350, 30, "Player blocking "+pc.block+" dmg", dmgStyle);
        ec.dmgText = game.add.text( 450, 250, "Enemy doing "+ec.dmg+" dmg", dmgStyle);
        ec.blockText = game.add.text( 450, 270, "Enemy blocking "+ec.block+" dmg", dmgStyle);
        
        
        endTurnText = game.add.text(400, 370, "END TURN", etStyle);
        
        endTurnText.inputEnabled = true;
        endTurnText.input.useHandCursor = true;
        endTurnText.events.onInputDown.add(endTurn, this);


        { // generate the deck

            for(let i = 0;i < 5;i++)
            {
                console.log("here");
                // Generate five smash
                let temp = new card("Smash", "smash", 6, 3, 0, 0, 1);
                deck.push(temp);

            }
        
            for(let i = 5;i < 10;i++)
            {
                // Five Slash
                let temp = new card("Slash","slash",12,2,0,0,2);
                deck.push(temp);
            }
        
            for(let i = 10; i < 15;i++)
            {
                // Five Block
                let temp = new card("Block","block",0,0,6,2,1);
                deck.push(temp);
            }
        
            for(let i = 15;i < 20;i++)
            {
                // Five Hunker Down
                let temp = new card("Hunker Down", "hunker_down",0,0,12,1,2);
                deck.push(temp);
            }

            for(let i = 0; i < 20; i++)
            {
                let x = deck[i];
                deck[i].obj = game.add.sprite(0, 0, deck[i].img);
                deck[i].obj.visible = false;
                deck[i].obj.inputEnabled = true;
                deck[i].obj.events.onInputDown.add(function(){
                    doCard(x);
                }, this);
                deck[i].obj.input.useHandCursor = true;
            }
        }
        console.log(deck);
        shuffleDeck(deck);
        drawCards();
        enemyDecide();

        let instructions = game.add.sprite(0,0, 'instructions');
        instructions.inputEnabled = true;
        instructions.input.useHandCursor = true;
        instructions.events.onInputDown.add(function(){
            instructions.destroy();
        }, this);

    }



    function update()
    {


        pc.hpText.text = "" + pc.hp + "/" + pc.maxhp + "hp";
        ec.hpText.text = "" + ec.hp + "/" + ec.maxhp + "hp";
        pc.apText.text = "AP: " + pc.ap;

        pc.dmgText.text = "Player doing "+pc.dmg+" dmg";
        pc.blocktext.text = "Player blocking "+pc.block+" dmg";
        ec.dmgText.text = "Enemy doing "+ec.dmg+" dmg";
        ec.blockText.text = "Enemy blocking "+ec.block+" dmg";

        if(ec.hp <= 0)
        {
            ec.hp = ec.maxhp;
            /* player win */
            let playerWin = game.add.sprite(0,0, 'playerwon');
            playerWin.inputEnabled = true;
            playerWin.events.onInputDown.add(function(){
                resetGame();
                playerWin.destroy();
            }, this);
        }
        else if(pc.hp <= 0)
        {
            pc.hp = pc.maxhp;
            /* enemy win */
            let enemyWin = game.add.sprite(0,0, 'enemywon');
            enemyWin.inputEnabled = true;
            enemyWin.events.onInputDown.add(function(){
                resetGame();
                enemyWin.destroy();
            }, this);
        }



    }

    function resetGame()
    {
        /* fix pc, ec */
        pc.hp = pc.maxhp;
        pc.ap = pc.maxap;
        pc.dmg = 0;
        pc.block = 0;

        ec.hp = ec.maxhp;
        ec.dmg = 0;
        ec.block = 0;

        /* fix deck */
        if(hand.length > 0)
        {
            let toDiscard = hand.length;
            for(let i = 0; i < toDiscard; i++)
            {
                let temp = hand.pop();
                temp.visible = false;
                discard.push(temp);
            }
        }

        if(discard.length > 0)
        {
            let toDeck = discard.length;
            for(let i = 0; i < toDeck; i++)
            {
                deck.push(discard.pop());
            }
        }

        /* shuffle deck */
        shuffleDeck(deck);

        /* draw cards */
        drawCards();

        /* enemy decision logic */
        enemyDecide();
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
        let xsp = 220;
        for(let i = 0; i < 4; i++)
        {
            if(deck.length > 0)
            {
                hand.push(deck.pop());
            }
            else
            {
                let discardAmt = discard.length;
                for(let j = 0; j < discardAmt; j++)
                {
                    deck.push(discard.pop());
                    //shuffleDeck(deck);
                }
                shuffleDeck(deck);
                hand.push(deck.pop());
                console.log("discard -> deck");
                console.log(hand);
            }
        }
        for(let i = 0; i < 4; i++)
        {
            hand[i].obj.visible = true;
            hand[i].obj.alpha = 0;
            let temp = hand[i].obj;
            game.time.events.add(500 * i, function() {
                game.add.tween(temp).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }, this);
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

    function endTurn()
    {
        console.log("end turn");
        let damageDone = pc.dmg - ec.block;
        if(damageDone > 0)
        {
            ec.hp -= damageDone;
        }
        damageDone = ec.dmg - pc.block;
        if(damageDone > 0)
        {
            pc.hp -= damageDone;
        }
        for(let i = 0; i < 4; i++)
        {
            let temp = hand.pop();
            temp.obj.visible = false;
            discard.push(temp);
        }
        pc.dmg = 0;
        pc.block = 0;
        pc.ap = pc.maxap;
        ec.dmg = 0;
        ec.block = 0;

        drawCards();
        enemyDecide();
    }

    function enemyDecide()
    {
        let dmgDo = 0;
        let blockDo = 0;
        let whatdo = game.rnd.integerInRange(0,100);
        if(whatdo < 40)
        {
            dmgDo += 10;
        }
        else if(whatdo < 80)
        {
            blockDo += 10;
        }
        else if(whatdo < 90)
        {
            dmgDo += 20;
        }
        else
        {
            blockDo += 20;
        }
        ec.dmg = dmgDo;
        ec.block = blockDo;


    }

    function doCard(card)
    {
        /*
            Read in card, apply the actions, finit.
            function card(name, img, dmgrange, flatdmg, blockrange, flatblock, ap)
        */
        let dmgDo = 0;
        let blockDo = 0;
        console.log("Doing card: " + card.name);


        let dmgStyle = { font: "50pt Comic Sans", fill: "red", align: "left" };
        let blockStyle = { font: "50pt Comic Sans", fill: "white", align: "left" };


        if(pc.ap >= card.ap)
        {
            pc.ap -= card.ap;
            // card.obj.visible = false;
            game.add.tween(card.obj).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            if(card.dmgrange > 0)
            {
                dmgDo += game.rnd.integerInRange(1, card.dmgrange);
            }
            dmgDo += card.flatdmg;
            if(card.blockrange > 0)
            {
                blockDo += game.rnd.integerInRange(1, card.blockrange);
            }
            blockDo += card.flatblock;

            if(dmgDo > 0)
            {
                let dmgText = game.add.text(card.obj.x+75,card.obj.y+100,"" + dmgDo, dmgStyle);
                game.add.tween(dmgText).to({alpha:0}, 1000, Phaser.Easing.Linear.None, true);
                game.time.events.add(600, function(){
                    dmgText.destroy();
                }, this);
            }

            if(blockDo > 0)
            {
                let blockText = game.add.text(card.obj.x+75, card.obj.y+100,"" + blockDo, blockStyle);
                game.add.tween(blockText).to({alpha:0}, 1000, Phaser.Easing.Linear.None, true);
                game.time.events.add(600, function(){
                    blockText.destroy();
                }, this);
            }
            card.obj.visible = false;
        }



        pc.dmg += dmgDo;
        pc.block += blockDo;



        
    }

};
