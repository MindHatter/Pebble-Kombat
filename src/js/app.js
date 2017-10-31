/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var vibe = require('ui/vibe');

var mode;

// Fighters
function Fighter(config, ai) {
  this.name = config[0];
  this.base = config[1];
  this.ai = ai;
  this.hp = {
    'h': Math.round(Math.random() * 10 + 30 * this.base),
    'b': Math.round(Math.random() * 10 + 30 * this.base),
    'f': Math.round(Math.random() * 10 + 30 * this.base),
  };

  this.blocking = function (block) {
    if (this.ai == 'Enemy'){
      this.save = ['h', 'b', 'f'];
      for (var i = 0; i < 3; i++){
        if (this.hp[parts[i]] < 10){
          this.save.push(parts[i], parts[i], parts[i]);
        }
        if (this.hp[parts[i]] < 20){
          this.save.push(parts[i]);
        }
      }
      this.block = this.save[Math.floor(Math.random() * this.save.length)];
    } else {
      this.block = block;
    }
  };

  this.shoting = function (shot) {
    this.damage = Math.round(Math.random() + 5 * this.base);
    this.shot = shot;
  };
}

var main_wnd = new UI.Window();
var choice_wnd = new UI.Window();
var info_wnd = new UI.Window();

// Main
function main_wnd_gen(){
  var main_menu = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    image: 'MENU',
    compositing: 'set'
  });
  main_wnd.add(main_menu);

  // var info = new UI.Text({
  //   position: new Vector2(0, 148),
  //   size: new Vector2(144, 20),
  //   text: "info (long down)",
  //   font: 'GOTHIC_14_BOLD',
  //   color: 'white',
  //   textAlign: 'center',
  //   // backgroundColor: 'white'
  // });
  // main_wnd.add(info)
}

main_wnd.on('click', 'up', function() {
  // main_wnd.hide()
  mode = "TOURNAMENT";
  choice_wnd_gen();
  choice_wnd.show();
});

main_wnd.on('click', 'select', function() {
  // main_wnd.hide()
  mode = "SURVIVAL";
  choice_wnd_gen();
  choice_wnd.show();
});

main_wnd.on('click', 'down', function() {
  // main_wnd.hide()
  mode = "MADCAP";
  choice_wnd_gen();
  choice_wnd.show();
});

// main_wnd.on('longClick', 'down', function() {
//   info_wnd_gen();
//   info_wnd.show();
// });

main_wnd.on('click', 'back', function() {
  main_wnd.hide();
});

main_wnd_gen();
main_wnd.show();

// Choice
var choice;
var hero_select;

function choice_wnd_gen(){
  choice = [
    ['Assasin', 20, 40], 
    ['Berserk', 56, 40],
    ['Warrior', 92, 40],
    ['HeadHunter', 20, 77],
    ['Monk', 92, 77],
    ['Necro', 20, 112],
    ['Guardian', 56, 112],
    ['SwordMan', 92, 112]
  ];

  choice_wnd._items = [];
  hero_select = 0;

  var choice_back = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 149),
    backgroundColor: 'white'
  });
  choice_wnd.add(choice_back);

  var choice_title = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 20),
    text: mode + "\nChoose your HERO",
    font: 'GOTHIC_14_BOLD',
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white'
  });
  choice_wnd.add(choice_title);

  var choice_border = new UI.Image({
    position: new Vector2(choice[hero_select][1]-1, choice[hero_select][2]-1),
    size: new Vector2(34, 34),
    image: 'images/avatar/border.png'
  });
  choice_wnd.add(choice_border);

  for (var i = 0; i < choice.length; i++){
    var img = new UI.Image({
      position: new Vector2(choice[i][1], choice[i][2]),
      size: new Vector2(32, 32),
      image: 'images/avatar/'+choice[i][0]+'.png',
      compositing: 'set'
    });
    choice_wnd.add(img);
  }

  var hero_name = new UI.Text({
    position: new Vector2(0, 149),
    size: new Vector2(144, 15),
    text: choice[hero_select][0],
    font: 'GOTHIC_14_BOLD',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'black'
  });

  var mode_center = new UI.Image({
    position: new Vector2(56, 77),
    size: new Vector2(32, 32),
    image: 'images/avatar/'+mode+'.png',
    compositing: 'set'
  });

  choice_wnd.add(hero_name);
  choice_wnd.add(mode_center);
}

choice_wnd.on('click', 'up', function () {
  if (hero_select === 0) 
    hero_select = 7;
  else
    hero_select -= 1;
  choice_wnd._items[11].text(choice[hero_select][0]);
  choice_wnd._items[2].position(new Vector2(choice[hero_select][1]-1, choice[hero_select][2]-1));
});

choice_wnd.on('click', 'select', function () {
  all = [
    ['Assasin', 1.4], 
    ['Berserk', 1.8],
    ['Warrior', 1.6],
    ['HeadHunter', 1.6],
    ['Monk', 1.3],
    ['Necro', 1.3],
    ['Guardian', 1.5],
    ['SwordMan', 1.4],
    ['Archer', 1.3]
  ];

  player = new Fighter(all[hero_select], "You");

  game_wnd_gen();
  game_wnd.show();
  choice_wnd.hide();
});

choice_wnd.on('click', 'down', function () {
  if (hero_select == 7) 
    hero_select = 0;
  else
    hero_select += 1;
  choice_wnd._items[11].text(choice[hero_select][0]);
  choice_wnd._items[2].position(new Vector2(choice[hero_select][1]-1, choice[hero_select][2]-1));
});

// Functions

function check_step(part) {
  if (mode == "MADCAP"){
    var i, j, temp;
    for (i = 2; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = player.hp[parts[i]];
      player.hp[parts[i]] = player.hp[parts[j]];
      player.hp[parts[j]] = temp;
    }
  }

  if (type_step[0] == "SHOT!") {
    heroes[1].blocking(parts[Math.floor(Math.random() * parts.length)]);
    heroes[0].shoting(part);
  } else {
    heroes[1].blocking(part);
    heroes[0].shoting(parts[Math.floor(Math.random() * parts.length)]);
  }

  if (heroes[0].shot != heroes[1].block) {

    if (heroes[1].name == 'Guardian'){
      var damage = Math.floor(heroes[0].damage / 2);
      if (heroes[1].block == 'h' && heroes[0].shot == 'b') {
        heroes[1].hp.b -= damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot + "\n";
      }
      else if (heroes[1].block == 'b' && heroes[0].shot == 'f') {
        heroes[1].hp.f -= damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot + "\n";
      }
      else if (heroes[1].block == 'f' && heroes[0].shot == 'b') {
        heroes[1].hp.b -= damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot + "\n";
      } 
      else {
        vibe.vibrate('long');
        heroes[1].hp[heroes[0].shot] -= heroes[0].damage;
        status_line = heroes[1].ai + " lost " + heroes[0].damage + "hp/" + heroes[0].shot + "\n";
      }
    } else {
      vibe.vibrate('long');
      heroes[1].hp[heroes[0].shot] -= heroes[0].damage;
      status_line = heroes[1].ai + " lost " + heroes[0].damage + "hp/" + heroes[0].shot + "\n";
    }
  } else {
    status_line = ''; //heroes[1].ai + ' blocked ';
  }

  if (heroes[0].name == 'Assasin' && heroes[1].name != 'HeadHunter'){
    var part = Math.floor(Math.random() * parts.length);
    var damage = Math.floor(Math.random() * 3 + 2);
    if (parts[part] != heroes[1].block){
      heroes[1].hp[parts[part]] -= damage;
      status_line += heroes[1].ai + " lost " + damage + "hp/" + parts[part] + "\n";
    }
  }

  if (heroes[0].name == 'Berserk' && heroes[1].name != 'HeadHunter'){
    if (heroes[0].shot == heroes[1].block && heroes[0].hp[heroes[0].shot] <= 30){
      var damage = Math.floor(heroes[0].damage / 2);
      heroes[1].hp[heroes[0].shot] -= damage;
      status_line += heroes[1].ai + " lost " + damage + "hp/" + part + "\n";
    }
  }

  if (heroes[1].name == 'Monk'){
    var part = Math.floor(Math.random() * parts.length);
    heroes[1].hp[parts[part]] += 3;
    status_line += heroes[1].ai+" heal 3hp/" + parts[part] + "\n";
  }

  if (heroes[1].name == 'Warrior' && heroes[0].name != 'HeadHunter'){
    var part = Math.floor(Math.random() * parts.length);
    if (heroes[0].block != parts[part]) {
      heroes[0].hp[parts[part]] -= 4;
      status_line += heroes[0].ai + " lost 4hp/" + parts[part] + "\n";
    }
  }

  if (heroes[1].name == 'Necro'){
    if (heroes[0].shot == heroes[1].block){
      heroes[0].hp[heroes[0].shot] -= heroes[0].damage;
      status_line += heroes[0].ai + " lost " + heroes[0].damage + "hp/" + heroes[0].shot + "\n";
    }
  }

  if (heroes[0].name == 'SwordMan' && heroes[1].name != 'HeadHunter'){
    var damage = Math.floor(heroes[0].damage * 0.4);

    if (heroes[0].shot === 'h') {
      status_line += heroes[1].ai + " lost " + damage + "hp/"
      if (heroes[1].block != 'b'){
        heroes[1].hp.b -= damage;
        status_line += "b"
      }
      if (heroes[1].block != 'f'){
        heroes[1].hp.f -= damage;
        status_line += "f"
      }
    }

    if (heroes[0].shot === 'b'){
      status_line += heroes[1].ai + " lost " + damage + "hp/"
      if (heroes[1].block != 'h'){
        heroes[1].hp.h -= damage;
        status_line += "h"
      }
      if (heroes[1].block != 'f'){
        heroes[1].hp.f -= damage;
        status_line += "f"
      }
    }

    if (heroes[0].shot === 'f') {
      status_line += heroes[1].ai + " lost " + damage + "hp/"
      if (heroes[1].block != 'h'){
        heroes[1].hp.h -= damage;
        status_line += "h"
      }
      if (heroes[1].block != 'b'){
        heroes[1].hp.b -= damage;
        status_line += "b"
      }
    }
  }

  if (heroes[0].name == "Archer"){
    if (step == 0){
      if (heroes[0].shot != heroes[1].block){
        heroes[1].hp[heroes[0].shot] -= heroes[0].damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot + "\n";
      }
    }

    if (step == 1){
      var parts_copy = parts.slice();
      var index = parts_copy.indexOf(heroes[0].shot);
      if (index > -1) {
        parts_copy.splice(index, 1);
      }
      var part = Math.floor(Math.random() * parts_copy.length);
      var damage = Math.floor(heroes[0].damage * 0.75)

      if (heroes[0].shot != heroes[1].block){
        heroes[1].hp[heroes[0].shot] -= damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot;
      }

      if (part != heroes[1].block){
        heroes[1].hp[part] -= damage;
        status_line += part;
      }
    }

    if (step == 2){
      var damage = Math.floor(heroes[0].damage * 0.5)
      var parts_copy = parts.slice();
      var index = parts_copy.indexOf(heroes[0].shot);
      if (index > -1) {
        parts_copy.splice(index, 1);
      }

      if (heroes[0].shot != heroes[1].block){
        heroes[1].hp[heroes[0].shot] -= damage;
        status_line = heroes[1].ai + " lost " + damage + "hp/" + heroes[0].shot;
      }

      if (heroes[1].block != parts_copy[0]){
        heroes[1].hp[part] -= damage;
        status_line += parts_copy[0];
      }

      if (heroes[1].block != parts_copy[1]){
        heroes[1].hp[part] -= damage;
        status_line += parts_copy[1];
      }
    }

    if (step == 2){
      step = 0;
    } else {
      step = step + 1;
    }
  }

  for (var i in heroes[1].hp){
    if (heroes[1].hp[i] <= 0) {
      if (heroes[1].ai === "You") {
        dead_message = 'YOU LOSE!';
        dead_img = 'INFO_SKULL_A';
        check_die = true;
      } else {
        dead_message = 'YOU WIN!';
        dead_img = 'INFO_RAVEN';
        check_die = true;
      }
    }
  }

  if (check_die) {
    game_over_wnd = new UI.Window();
    
    var game_over_back = new UI.Rect({
      position: new Vector2(0, 0),
      size: new Vector2(144, 168),
      backgroundColor: 'white'
    });
    game_over_wnd.add(game_over_back);
    
    if (all.length != 0){
      var msg = new UI.Text({
        position: new Vector2(0, 50),
        size: new Vector2(144, 40),
        text: dead_message,
        font: 'GOTHIC_28_BOLD',
        color: 'black',
        textOverflow: 'wrap',
        textAlign: 'center',
        backgroundColor: 'white'
      });
      game_over_wnd.add(msg);

      var img = new UI.Image({
        position: new Vector2(56, 100),
        size: new Vector2(32, 32),
        image: dead_img,
        compositing: 'set'
      });
      game_over_wnd.add(img);
    } else {
      var title = new UI.Text({
        position: new Vector2(0, 38),
        size: new Vector2(144, 20),
        text: "YOU ARE CHAMPION!",
        font: 'GOTHIC_18_BOLD',
        color: 'black',
        textOverflow: 'wrap',
        textAlign: 'center',
        backgroundColor: 'white'
      });
      game_over_wnd.add(title);

      var mode_center = new UI.Image({
        position: new Vector2(56, 58),
        size: new Vector2(32, 32),
        image: 'images/avatar/'+mode+'.png',
        compositing: 'set'
      });
      game_over_wnd.add(mode_center);

      var text = new UI.Text({
        position: new Vector2(5, 90),
        size: new Vector2(134, 60),
        text: 'Congratulations!\nYou win all fighters in\n' + mode + ' mode.',
        font: 'GOTHIC_14_bold',
        color: 'black',
        textOverflow: 'wrap',
        textAlign: 'center',
        backgroundColor: 'white'
      });
      game_over_wnd.add(text);
    }

    game_over_wnd.show();
    game_wnd.hide();

    game_over_wnd.on('click', function() {
      if (all.length == 0 || dead_message == "YOU LOSE!"){
        main_wnd.show();
        game_over_wnd.hide();
      } else {
        if (mode == "TOURNAMENT" || mode == "MADCAP"){
          for (var i = 0; i < 3; i++){
            player.hp[parts[i]] = Math.round(Math.random() * 10 + 20 * player.base);
          }
        }

        if (mode == "SURVIVAL"){
          for (var i = 0; i < 3; i++){
            player.hp[parts[i]] += 10;
          }
        }

        game_wnd_gen();
        game_wnd.show();
        game_over_wnd.hide();
      }
    });
  }
}

// Game
var game_wnd = new UI.Window();

var all;
var player;
var enemy;
var die;
var heroes;
var type_step;
var parts = ['h', 'b', 'f'];
var parts_count = {'h': 0, 'b': 1, 'f': 2};
var side;
var step = 0;

function game_wnd_gen(){
  game_wnd._items = [];

  check_die = false;
  rand = parseInt(Math.random() * all.length);
  enemy = new Fighter(all[rand], "Enemy");
  all.splice(rand, 1);

  if (enemy.name == "HeadHunter"){
      heroes = [enemy, player];
      type_step = ['BLOCK!', 'SHOT!'];
      side = ['_r', '_l'];
  } else {
      heroes = [player, enemy];
      type_step = ['SHOT!', 'BLOCK!'];
      side = ['_l', '_r'];
  }

  var back = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(144, 144),
    image: "images/back/" + enemy.name + ".png",
    backgroundColor: "white",
  });

  var player_ava = new UI.Image({
      position: new Vector2(5, 40),
      size: new Vector2(72, 104),
      image: 'images/char/' + player.name + '.png',
      compositing: "set"
  });

  // var enemy_ava = new UI.Image({
  //     position: new Vector2(68, 44),
  //     size: new Vector2(72, 104),
  //     image: 'images/enemy/' + enemy.name + '.png',
  //     compositing: 'set'
  // });

  game_wnd.add(back);
  game_wnd.add(player_ava);
  // game_wnd.add(enemy_ava);

  for (i = 0; i < 3; i++){
    var left = new UI.Text({
      position: new Vector2(0, 42+i*30),
      size: new Vector2(16, 16),
      text: player.hp[parts[i]],
      font: 'GOTHIC_14_BOLD',
      color: 'white',
      textAlign: 'center',
      backgroundColor: 'black' 
    });
    var right = new UI.Text({
      position: new Vector2(130, 42+i*30),
      size: new Vector2(16, 16),
      text: enemy.hp[parts[i]],
      font: 'GOTHIC_14_BOLD',
      color: 'white',
      textAlign: 'center',
      backgroundColor: 'black' 
    });

    game_wnd.add(left);
    game_wnd.add(right);
  }

  var block = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(30, 30),
    image: '',
    compositing: 'set'
  });

  var attack = new UI.Image({
    position: new Vector2(0, 0),
    size: new Vector2(30, 30),
    image: '',
    compositing: 'set'
  });

  game_wnd.add(block);
  game_wnd.add(attack);

  var status = new UI.Text({
    position: new Vector2(5, 5),
    size: new Vector2(134, 32),
    text: player.name + " vs " + enemy.name,
    font: 'GOTHIC_14_BOLD',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'black'
  });

  var step = new UI.Text({
    position: new Vector2(0, 148),
    size: new Vector2(144, 20),
    text: type_step[0],
    font: 'GOTHIC_14_BOLD',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'black'
  });

  game_wnd.add(status);
  game_wnd.add(step);
}

function game_wnd_update(){
  for (i = 0; i < 3; i++){
    game_wnd._items[2+i*2].text(player.hp[parts[i]]);
    game_wnd._items[3+i*2].text(enemy.hp[parts[i]]);
  }

  game_wnd._items[8].position(new Vector2(57, 42+30*parts_count[heroes[0].block]));
  game_wnd._items[8].image('images/block/' + heroes[0].name + side[0] + '.png');
  game_wnd._items[9].position(new Vector2(57, 42+30*parts_count[heroes[1].shot]));
  game_wnd._items[9].image('images/attack/' + heroes[1].name + side[1] + '.png');

  game_wnd._items[10].text(status_line);
  game_wnd._items[11].text(type_step[0]);
}

game_wnd.on('click', 'up', function () {
  check_step('h');
  type_step.reverse();
  heroes.reverse();
  side.reverse();
  game_wnd_update();
  
});

game_wnd.on('click', 'select', function () {
  check_step('b');
  type_step.reverse();
  heroes.reverse();
  side.reverse();
  game_wnd_update();
});

game_wnd.on('click', 'down', function () {
  check_step('f');
  type_step.reverse();
  heroes.reverse();
  side.reverse();
  game_wnd_update();
});

// Info
var page = 0;
var info_wnd_content = [
  ['HELLO FIGHTERS!', '"Pebble Kombat" - simple tactical mini fighting with simple rules. You can read all about project on the Pebble Forum page.', 'INFO_SKULL_D', 'Continue >'],
  ['GAME PROCESS', 'Game process divide by two phase where you choose what part you want to shot or block. Every character has own value of HP for every part. You lose if one of part down below zero.', '', 'Continue >'],
  ['FEATURES', 'Warning! Every char has own passive ability!\n\nTwo play mode: Tournament and Survival. More info on the Pebble Forum page', 'INFO_SKULL_A', 'Continue >'],
  ['AUTHORS', 'Idea & Coding -\nAlexander Menshikov.\n\nGraphics -\nDaria Nekrasova.\n\nFeel free to ask any question.', '', 'Continue >'],
  ['PK FUTURE', 'If you\'ll enjoy to play PK, please like us or donate for the more beautiful "Pebble Kombat 2" with more characters, abilities and modes ;) More info on the Pebble Forum page.', 'INFO_RAVEN', 'Good fight!'
  ],
];

function info_wnd_gen(){
  info_wnd._items = [];

  var info_back = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor: 'white'
  });
  info_wnd.add(info_back);
  
  var title = new UI.Text({
    position: new Vector2(5, 5),
    size: new Vector2(134, 20),
    text: info_wnd_content[page][0],
    font: 'GOTHIC_18_BOLD',
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white'
  });
  info_wnd.add(title);

  var info = new UI.Text({
    position: new Vector2(5, 30),
    size: new Vector2(134, 133),
    text: info_wnd_content[page][1],
    font: 'GOTHIC_14',
    color: 'black',
    textAlign: 'left',
    backgroundColor: 'white'
  });
  info_wnd.add(info);

  if (info_wnd_content[page][2] !== ''){
  var info_img = new UI.Image({
    position: new Vector2(110, 120),
    size: new Vector2(32, 32),
    image: info_wnd_content[page][2],
    compositing: 'set'
  });
  info_wnd.add(info_img);
}

  var cont = new UI.Text({
    position: new Vector2(75, 145),
    size: new Vector2(70, 20),
    text: info_wnd_content[page][3],
    font: 'GOTHIC_14_BOLD',
    color: 'black',
    textAlign: 'left',
    backgroundColor: 'white'
  });
  info_wnd.add(cont);

  info_wnd.show();
}

info_wnd.on('click', 'down', function () {
  if (page == 4) {
    main_wnd_gen();
    info_wnd.hide();
    
  } else {
    page = page + 1;
    info_wnd.hide();
    info_wnd_gen();
  }
});