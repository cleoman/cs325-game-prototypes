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
    }

    let player1arrows = new Array();
    let player2arrows = new Array();

    let d = new Date();
    let player1ls = Date.now();
    let player2ls = Date.now();

    let timebetweenp1 = 500;
    let timebetweenp2 = 500;
    let scrolltime = 2000;

    let player1score = 0;

    function create()
    {

      // player1arrows.push(game.add.sprite(40, 0, 'letters'));
      // player1arrows.push(game.add.sprite(160, 0, 'letters'));
      // player1arrows[1].frame = 1;
      // player1arrows.push(game.add.sprite(280, 0, 'letters'));
      // player1arrows[2].frame = 2;

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
      keyj.onDown.add(keyjdown, this);
      keyk.onDown.add(keykdown, this);
      keyl.onDown.add(keyldown, this);
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
            player1score++;
            temp.destroy();
          }
          else
          {
            player1score--;
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
