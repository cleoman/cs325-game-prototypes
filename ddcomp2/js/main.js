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



    function preload()
    {
        game.load.spritesheet('letters', 'assets/leddars.png', 100, 100, 12);
        game.load.spritesheet('lettersgrn', 'assets/leddarsgrn.png', 100, 100, 12);
        game.load.image('bg', 'assets/bg.png');
        game.load.image('instr', 'assets/instructions.png');
        game.load.image('p1win', 'assets/p1win.png');
        game.load.image('p2win', 'assets/p2win.png');

        game.load.audio('ding', 'assets/dingCling-positive.ogg');
        game.load.audio('bgm', 'assets/bgm.mp3');
    }

    let player1arrows = new Array();
    let player2arrows = new Array();

    let d = new Date();
    let player1ls = Date.now();
    let player2ls = Date.now();

    let originaltb = 500;
    let timebetweenp1 = originaltb;
    let timebetweenp2 = timebetweenp1;
    let scrolltime = 2000;
    let tbdelta = 10;

    let droptime = '+1000';

    let player1score = 0;
    let player1scoretext;
    let player1delaytext;
    let player2score = 0;
    let player2scoretext;
    let player2delaytext;

    let ding;

    function create()
    {

      // player1arrows.push(game.add.sprite(40, 0, 'letters'));
      // player1arrows.push(game.add.sprite(160, 0, 'letters'));
      // player1arrows[1].frame = 1;
      // player1arrows.push(game.add.sprite(280, 0, 'letters'));
      // player1arrows[2].frame = 2;

      // background and audio
      let bg = game.add.sprite(0,0,'bg');
      ding = game.add.audio('ding');
      ding.volume = 0.4;

      let bgm = game.add.audio('bgm');
      bgm.loop = true;
      bgm.volume = 0.1;


      // 'goal' boxes
      let qgrn = game.add.sprite(40, 460, 'lettersgrn');
      let wgrn = game.add.sprite(160, 460, 'lettersgrn');
      wgrn.frame = 1;
      let egrn = game.add.sprite(280, 460, 'lettersgrn');
      egrn.frame = 2;
      let ugrn = game.add.sprite(620, 460, 'lettersgrn');
      ugrn.frame = 6;
      let igrn = game.add.sprite(740, 460, 'lettersgrn');
      igrn.frame = 7;
      let ogrn = game.add.sprite(860, 460, 'lettersgrn');
      ogrn.frame = 8;

      // player 1 keys
      let keyq = game.input.keyboard.addKey(Phaser.Keyboard.Q);
      let keyw = game.input.keyboard.addKey(Phaser.Keyboard.W);
      let keye = game.input.keyboard.addKey(Phaser.Keyboard.E);
      let keya = game.input.keyboard.addKey(Phaser.Keyboard.A);
      let keys = game.input.keyboard.addKey(Phaser.Keyboard.S);
      let keyd = game.input.keyboard.addKey(Phaser.Keyboard.D);

      //player 2 keys
      let keyu = game.input.keyboard.addKey(Phaser.Keyboard.U);
      let keyi = game.input.keyboard.addKey(Phaser.Keyboard.I);
      let keyo = game.input.keyboard.addKey(Phaser.Keyboard.O);
      let keyj = game.input.keyboard.addKey(Phaser.Keyboard.J);
      let keyk = game.input.keyboard.addKey(Phaser.Keyboard.K);
      let keyl = game.input.keyboard.addKey(Phaser.Keyboard.L);

      //player 1 key funcs
      keyq.onDown.add(keyqdown, this);
      keyw.onDown.add(keywdown, this);
      keye.onDown.add(keyedown, this);
      keya.onDown.add(keyadown, this);
      keys.onDown.add(keysdown, this);
      keyd.onDown.add(keyddown, this);

      //player 2 key funcs
      keyu.onDown.add(keyudown, this);
      keyi.onDown.add(keyidown, this);
      keyo.onDown.add(keyodown, this);
      keyj.onDown.add(keyjdown, this);
      keyk.onDown.add(keykdown, this);
      keyl.onDown.add(keyldown, this);

      //game text
      let style = { font: "24px Arial", fill: "#ff0044", align: "center" };

      player1scoretext = game.add.text(425, 100, "P1 Score: 0", style);
      player1scoretext.curScore = 0;
      player1delaytext = game.add.text(425, 200, "P1 Delay: " + timebetweenp1 + "ms", style);
      player1delaytext.curDelay = timebetweenp1;

      player2scoretext = game.add.text(425, 400, "P2 Score: 0", style);
      player2delaytext = game.add.text(425, 500, "P2 Delay: " + timebetweenp2 + "ms", style);
      player2scoretext.curScore = 0;
      player2delaytext.curDelay = timebetweenp2;

      //rules screen instructions
      let instr = game.add.sprite(0,0, 'instr');
      instr.inputEnabled = true;
      instr.events.onInputDown.add(function(){
        bgm.play();
        instr.destroy();
      }, this);

    }

    function update()
    {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

        if(player1arrows.length > 0){
          if(player1arrows[0].y > 510){
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(200, 300, "Oops!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            let temp = player1arrows.shift();
            temp.destroy();
            player2score++;
          }
        }
        if(player2arrows.length > 0){
          if(player2arrows[0].y > 510){
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(800, 300, "Oops!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            let temp = player2arrows.shift();
            temp.destroy();
            player1score++;
          }
        }

        if(player1scoretext.curScore != player1score){
          player1scoretext.text = "P1 Score: " + player1score;
          player1scoretext.curScore = player1score;
          timebetweenp2 -= tbdelta;
          player2delaytext.text = "P2 Delay: " + timebetweenp2 + "ms";
        }
        if(player2scoretext.curScore != player2score){
          player2scoretext.text = "P2 Score: " + player2score;
          player2scoretext.curScore = player2score;
          timebetweenp1 -= tbdelta;
          player1delaytext.text = "P1 Delay: " + timebetweenp1 + "ms";
        }

        if(player1score >= 25)
        {
          player1score = 0;
          player2score = 0;
          let p1win = game.add.sprite(0,0, 'p1win');
          p1win.inputEnabled = true;
          p1win.events.onInputDown.add(function(){
            p1win.destroy();
          }, this);
          timebetweenp1 = originaltb;
          timebetweenp2 = originaltb;
        }
        else if(player2score >= 25)
        {
          player1score = 0;
          player2score = 0;
          let p2win = game.add.sprite(0,0, 'p2win');
          p2win.inputEnabled = true;
          p2win.events.onInputDown.add(function(){
            p2win.destroy();
          }, this);
          timebetweenp1 = originaltb;
          timebetweenp2 = originaltb;
        }



    }

    function clearArrays(){
      for(let i = 0; i < player1arrows; i++)
      {
        player1arrows[i].destroy();
      }
      for(let i = 0; i < player2arrows; i++)
      {
        player2arrows[i].destroy();
      }

      player1arrows = new Array();
      player2arrows = new Array();
    }

    function keyqdown()
    {
      keydown('q');
    }

    function keywdown()
    {
      keydown('w');
    }

    function keyedown()
    {
      keydown('e');
    }

    function keyadown()
    {
      keydown('a');
    }

    function keysdown()
    {
      keydown('s');
    }

    function keyddown()
    {
      keydown('d');
    }

    function keyjdown()
    {
      keydown('j');
    }

    function keykdown()
    {
      keydown('k');
    }

    function keyldown()
    {
      // let temp = game.add.sprite(280, 0, 'letters');
      // temp.frame = 2;
      // game.add.tween(temp).to( {y: '+1000'}, 2000, Phaser.Easing.Linear.None, true);
      // player1arrows.push(temp);
      keydown('l');
    }

    function keyudown()
    {
      keydown('u');
    }

    function keyidown()
    {
      keydown('i');
    }

    function keyodown()
    {
      keydown('o');
    }

    function keydown(key)
    {
      if(key == 'q' || key == 'w' || key == 'e')
      {
        if(player1arrows.length > 0){
          let compareframe = 0;
          if(key == 'w')
          {
            compareframe = 1;
          }
          if(key == 'e')
          {
            compareframe = 2;
          }

          let temp = player1arrows.shift();
          if(temp.y > 420 && temp.y < 500 && temp.frame == compareframe)
          {
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(200, 300, "Nice!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            //player1score++;
            temp.destroy();
            ding.play();
          }
          else
          {
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(200, 300, "Oops!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            player2score++;
            temp.destroy();
          }
        }
      }
      if(key == 'u' || key == 'i' || key == 'o')
      {
        if(player2arrows.length > 0){
          let compareframe = 6;
          if(key == 'i')
          {
            compareframe = 7;
          }
          if(key == 'o')
          {
            compareframe = 8;
          }

          let temp = player2arrows.shift();
          if(temp.y > 420 && temp.y < 500 && temp.frame == compareframe)
          {
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(800, 300, "Nice!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            //player2score++;
            temp.destroy();
            ding.play();
          }
          else {
            let style = { font: "36px Arial", fill: "red", align: "center" };
            let feedbackText = game.add.text(800, 300, "Oops!", style);
            game.time.events.add(0 , function() {   game.add.tween(feedbackText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);}, this);
            player1score++;
            temp.destroy();
          }
        }
      }
      if(key == 'j' || key == 'k' || key == 'l')
      {
        console.log(Date.now() - player2ls);
        if( (Date.now() - player2ls) > timebetweenp2)
        {
          let newx = 0;
          let newframe = 0;
          if(key == 'j')
          {
            newx = 40;
          }
          else if(key == 'k')
          {
            newx = 160;
            newframe = 1;
          }
          else if(key == 'l')
          {
            newx = 280;
            newframe = 2;
          }

          let temp = game.add.sprite(newx, 0, 'letters');
          temp.frame = newframe;
          game.add.tween(temp).to( {y: '+1000'}, scrolltime, Phaser.Easing.Linear.None, true);
          player1arrows.push(temp);
          player2ls = Date.now();
        }
      }
      if(key == 'a' || key == 's' || key == 'd')
      {
        if( (Date.now() - player1ls) > timebetweenp1)
        {
          // 620 740 860
          let newx = 620;
          let newframe = 6;
          if(key == 'a')
          {

          }
          else if(key == 's')
          {
            newx = 740;
            newframe = 7;
          }
          else if(key == 'd')
          {
            newx = 860;
            newframe = 8;
          }

          let temp = game.add.sprite(newx, 0, 'letters');
          temp.frame = newframe;
          game.add.tween(temp).to( {y: '+1000'}, scrolltime, Phaser.Easing.Linear.None, true);
          player2arrows.push(temp);
          player1ls = Date.now();
        }
      }
    }
};
