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

    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );



    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'background', 'assets/Background.png');
        // game.load.image( 'egg', 'assets/egg.png' );
        // game.load.audio( 'chickenmusic', 'assets/chicken.mp3');
        game.load.audio('music', 'assets/music.mp3');
        game.load.audio('throw1', 'assets/dieThrow1.mp3');
        game.load.audio('throw2', 'assets/dieThrow2.mp3');
        game.load.audio('throw3', 'assets/dieThrow3.mp3');
        // game.load.image( 'goldenegg', 'assets/goldenegg.png' );
        game.load.image( 'dice1', 'assets/dice1.png');
        game.load.image( 'dice2', 'assets/dice2.png');
        game.load.image( 'dice3', 'assets/dice3.png');
        game.load.image( 'dice4', 'assets/dice4.png');
        game.load.image( 'dice5', 'assets/dice5.png');
        game.load.image( 'dice6', 'assets/dice6.png');
        game.load.image( 'rollbutton', 'assets/ROLL DICE.png');
        game.load.image( 'lockbutton', 'assets/LOCKNROLL.png');
        game.load.image( 'rulesbutton', 'assets/RULES.png');
        game.load.image( 'newgamebutton', 'assets/NEWGAME.png');
        game.load.image( 'scoresheet', 'assets/scoresheet.png');
        game.load.image( 'rulesscreen', 'assets/rulesupdated.png');
        game.load.image( 'lock', 'assets/LOCK.png');
    }


    // let pdice1, pdice2, pdice3, pdice4, pdice5, pdice6;
    // let playerDice = [pdice1, pdice2, pdice3, pdice4, pdice5, pdice6];
    // let aidice1, aidice2, aidice3, aidice4, aidice5, aidice6;
    // let aiDice = [aidice1, aidice2, aidice3, aidice4, aidice5, aidice6];
    let playerDice = new Array();
    let aiDice = new Array();
    let playerScore = 0;
    let aiScore = 0;
    let MAX_TURNS = 10;
    let yourScoreText;
    let aiScoreText;
    let currentTurn = 0;
    let turnText;
    let music;
    let throw1;
    let throw2;
    let throw3;
    let newgameButton;
    let lockPhase = 0;
    let numLocked = 0;
    let numaiLocked = 0;
    let rollButton;

    function create() {

        // graphics
        let tileSprite = game.add.tileSprite(0, 0, 1000, 600, 'background');
        rollButton = game.add.button(40, 500, 'rollbutton', rollPlayerDice);
        let lockinButton = game.add.button(40, 500, 'lockbutton', doLock);
        lockinButton.visible = false;
        let rulesButton = game.add.button(760, 500, 'rulesbutton', showRules);
        newgameButton = game.add.button(40, 400, 'newgamebutton', newGame);
        newgameButton.visible = false;
        let scoresheet = game.add.sprite(270, 20, 'scoresheet');

        //text
        let textStyle = { font: "30pt Courier New", fill: "#eaff00", align: "center" };
        let scoreStyle = { font: "14pt Comic Sans", fill: "#000000", align: "left" };
        let aiScoreStyle = { font: "14pt Comic Sans", fill: "#000000", align: "right" };
        let yourrollText = game.add.text( 25, 10, "YOUR ROLL", textStyle );
        let airollText = game.add.text( 780, 10, "AI ROLL", textStyle );
        yourScoreText = game.add.text( 280, 100, "", scoreStyle );
        aiScoreText = game.add.text ( 510, 100, "", scoreStyle );
        turnText = game.add.text(400, 560, "TURN 0/" + MAX_TURNS, textStyle);

        //audio
        music = game.add.audio('music');
        throw1 = game.add.audio('throw1');
        throw2 = game.add.audio('throw2');
        throw3 = game.add.audio('throw3');
        music.volume = 0.1;
        throw1.volume = 0.4;
        throw2.volume = 0.4;
        throw3.volume = 0.4;
        music.play();


        // initialize dice
        playerDice[0] = game.add.sprite(40, 100, 'dice1');
        playerDice[0].value = 1;
        playerDice[1] = game.add.sprite(160, 100, 'dice2');
        playerDice[1].value = 1;
        playerDice[2] = game.add.sprite(40, 200, 'dice3');
        playerDice[2].value = 1;
        playerDice[3] = game.add.sprite(160, 200, 'dice4');
        playerDice[3].value = 1;
        playerDice[4] = game.add.sprite(40, 300, 'dice5');
        playerDice[4].value = 1;
        playerDice[5] = game.add.sprite(160, 300, 'dice6');
        playerDice[5].value = 1;

        aiDice[0] = game.add.sprite(760, 100, 'dice1');
        aiDice[0].value = 1;
        aiDice[1] = game.add.sprite(880, 100, 'dice2');
        aiDice[1].value = 1;
        aiDice[2] = game.add.sprite(760, 200, 'dice3');
        aiDice[2].value = 1;
        aiDice[3] = game.add.sprite(880, 200, 'dice4');
        aiDice[3].value = 1;
        aiDice[4] = game.add.sprite(760, 300, 'dice5');
        aiDice[4].value = 1;
        aiDice[5] = game.add.sprite(880, 300, 'dice6');
        aiDice[5].value = 1;

        for(let i = 0; i < 6; i++)
        {
          playerDice[i].inputEnabled = true;
          playerDice[i].events.onInputDown.add(function(){doLock(i)}, this);
          playerDice[i].lock = playerDice[i].addChild(game.make.sprite(60, 60, 'lock'));
          playerDice[i].locked = false;
          playerDice[i].lock.visible = false;
          aiDice[i].lock = aiDice[i].addChild(game.make.sprite(60, 60, 'lock'));
          aiDice[i].locked = false;
          aiDice[i].lock.visible = false;
        }

        showRules();


    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

    }

    function rollPlayerDice() {

      if(currentTurn < MAX_TURNS){
        for(let i = 0; i < 6; i++){
          if(lockPhase == 1){
            playerDice[i].input.useHandCursor = false;
          }
          else{
            playerDice[i].input.useHandCursor = true;
          }
          let newValue = game.rnd.integerInRange(1, 6);
          let aiValue = game.rnd.integerInRange(1, 6);
          console.log("set dice " + i + " to value " + newValue);
          if(playerDice[i].locked === false)
          {
            playerDice[i].value = newValue;
          }
          if(aiDice[i].locked === false)
          {
            aiDice[i].value = aiValue;
          }
        }
        updateDice();
        if(lockPhase == 1){
          scoreDice();
          currentTurn++;
          lockPhase = 0;
          rollButton.loadTexture('rollbutton');
          clearLocks();
        }else{
          lockPhase = 1;
          rollButton.loadTexture('lockbutton')
          aiLock();
        }
        if(currentTurn === MAX_TURNS){
          if(playerScore > aiScore){
            turnText.setText("PLAYER WINS!");
          } else if (aiScore > playerScore) {
            turnText.setText("AI WINS!");
          } else {
            turnText.setText("EVERYBODY LOSES!");
          }
          newgameButton.visible = true;
        }
        else {
        playDiceSound();
        turnText.setText("TURN " + currentTurn + "/" + MAX_TURNS);
        }
      }
    }

    // separate update dice function
    function updateDice() {
      for(let i = 0; i < 6; i++)
      {
        let newValue = playerDice[i].value;
        let aiValue = aiDice[i].value;
        if(newValue == 1){
          playerDice[i].loadTexture('dice1');
        } else if (newValue == 2) {
          playerDice[i].loadTexture('dice2');
        } else if (newValue == 3) {
          playerDice[i].loadTexture('dice3');
        } else if (newValue == 4) {
          playerDice[i].loadTexture('dice4');
        } else if (newValue == 5) {
          playerDice[i].loadTexture('dice5');
        } else if (newValue == 6) {
          playerDice[i].loadTexture('dice6');
        }
        if(aiValue == 1){
          aiDice[i].loadTexture('dice1');
        } else if (aiValue == 2) {
          aiDice[i].loadTexture('dice2');
        } else if (aiValue == 3) {
          aiDice[i].loadTexture('dice3');
        } else if (aiValue == 4) {
          aiDice[i].loadTexture('dice4');
        } else if (aiValue == 5) {
          aiDice[i].loadTexture('dice5');
        } else if (aiValue == 6) {
          aiDice[i].loadTexture('dice6');
        }
      }
    }

    function playDiceSound() {
      let soundToPlay = game.rnd.integerInRange(0,2);
      if(soundToPlay === 0){
        throw1.play();
      } else if (soundToPlay === 1) {
        throw2.play();
      } else {
        throw3.play();
      }
    }

    function scoreDice() {
      let playerCount = new Array();
      let aiCount = new Array();
      for(let i = 0; i < 6; i++){
        playerCount[i] = 0;
        aiCount[i] = 0;
        for(let j = 0; j < 6; j++){
          if(playerDice[j].value === i + 1){
            playerCount[i]++;
          }
          if(aiDice[j].value === i + 1){
            aiCount[i]++;
          }
        }
        console.log("I count " + playerCount[i] + "dice with point value of " + (i + 1));
      }

      /*
        How to count triples and beyond for dummies
      */
      if(playerCount[0] >= 3){
        console.log("Adding " + ((100 + ((playerCount[0] - 3) * 10))) + "to score of " + playerScore);
        playerScore += (100 + ((playerCount[0] - 3) * 10));
        console.log("New score: " + playerScore);
      }
      if(playerCount[1] >= 3){
        playerScore += (200 + ((playerCount[1] - 3) * 20));
      }
      if(playerCount[2] >= 3){
        playerScore += (300 + ((playerCount[2] - 3) * 30));
      }
      if(playerCount[3] >= 3){
        playerScore += (400 + ((playerCount[3] - 3) * 40));
      }
      if(playerCount[4] >= 3){
        playerScore += (500 + ((playerCount[4] - 3) * 50));
      }
      if(playerCount[5] >= 3){
        playerScore += (600 + ((playerCount[5] - 3) * 60));
      }
      if(playerCount[0] === 1 && playerCount[1] === 1 && playerCount[2] === 1 && playerCount[3] === 1 && playerCount[4] === 1 && playerCount[5] === 1){
        playerScore += 1000;
      }
      if(aiCount[0] >= 3){
        aiScore += (100 + ((aiCount[0] - 3) * 10));
      }
      if(aiCount[1] >= 3){
        aiScore += (200 + ((aiCount[1] - 3) * 20));
      }
      if(aiCount[2] >= 3){
        aiScore += (300 + ((aiCount[2] - 3) * 30));
      }
      if(aiCount[3] >= 3){
        aiScore += (400 + ((aiCount[3] - 3) * 40));
      }
      if(aiCount[4] >= 3){
        aiScore += (500 + ((aiCount[4] - 3) * 50));
      }
      if(aiCount[5] >= 3){
        aiScore += (600 + ((aiCount[5] - 3) * 60));
      }
      if(aiCount[0] === 1 && aiCount[1] === 1 && aiCount[2] === 1 && aiCount[3] === 1 && aiCount[4] === 1 && aiCount[5] === 1){
        aiScore += 1000;
      }
      playerScore -= (numLocked * 50);
      aiScore -= (numaiLocked * 50);
      yourScoreText.setText(yourScoreText.text + "\n" + playerScore);
      aiScoreText.setText(aiScoreText.text + "\n" + aiScore);

    }

    function showRules(){
      let rulesscreen = game.add.sprite(0, 0, 'rulesscreen');
      rulesscreen.inputEnabled = true;
      rulesscreen.events.onInputDown.add(function(){
        rulesscreen.destroy();
      }, this);
    }

    function newGame(){
      playerScore = 0;
      aiScore = 0;
      currentTurn = 0;
      yourScoreText.setText("");
      aiScoreText.setText("");
      turnText.setText("TURN " + currentTurn + "/" + MAX_TURNS);
      newgameButton.visible = false;
    }

    function doLock(diceIndex){
      if(lockPhase === 1)
      {
        if(playerDice[diceIndex].lock.visible === false && numLocked < 3){
          playerDice[diceIndex].lock.visible = true;
          playerDice[diceIndex].locked = true;
          numLocked++;
        }
        else if(playerDice[diceIndex].lock.visible === true)
        {
          playerDice[diceIndex].lock.visible = false;
          playerDice[diceIndex].locked = false;
          numLocked--;
        }
      }
    }

    function aiLock(){
      let aiCount = new Array();
      for(let i = 0;i < 6; i++)
      {
        aiCount[i] = 0;
        for(let j = 0;j < 6; j++)
        {
          if(aiDice[j].value === i + 1)
          {
            aiCount[i]++;
          }
        }
      }

      // ^^^ can merge this logic up into that loop ^^^
      let max = 0;
      let maxIndex = 0;
      for(let i = 0;i < 6; i++)
      {
        if(aiCount[i] >= max)
        {
          max = aiCount[i];
          maxIndex = i;
        }
      }
      console.log('ai has ' + max + ' dice with value ' + (maxIndex+1));
      for(let i = 0;i < 6; i++)
      {
        if(aiDice[i].value === (maxIndex+1) && numaiLocked < 3)
        {
          aiDice[i].locked = true;
          aiDice[i].lock.visible = true;
          numaiLocked++;
        }
      }
    }

    function clearLocks(){
      for(let i = 0;i < 6; i++)
      {
        numLocked = 0;
        numaiLocked = 0;
        playerDice[i].locked = false;
        playerDice[i].lock.visible = false;
        aiDice[i].locked = false;
        aiDice[i].lock.visible = false;
      }
    }
};
