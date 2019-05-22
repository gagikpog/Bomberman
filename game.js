//Создание и инициализация окна. Далле все обрашение к игре происходит через переменную game.
let game = new Phaser.Game(496, 240, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var man;
var door;
var bonus;
var bombs = [];
var mobs = [];
var blocks = [];
var bumGroupbombsGroup;
var bumGroup;
var mobGroup;
var walls;
var wallsBrocken;
var rect;
var mobsCount = 10;
var time = 180;
var score = 0;
var isGame = true;
var statge = 1;

function preload() {
    game.stage.backgroundColor = '#1F8B00';
    if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1){
        // Do Firefox-related activities
        game.load.baseURL = 'https://raw.githubusercontent.com/gagikpog/Bomberman/master/';
        game.load.crossOrigin = 'anonymous';
    }
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.spritesheet('man', 'imgs/man.png', 16, 16, 21);
    game.load.spritesheet('mob1', 'imgs/mob1.png', 16, 16, 11);
    game.load.spritesheet('bomb', 'imgs/bomb.png', 16, 16, 3);
    game.load.spritesheet('bum', 'imgs/bum.png', 48, 48, 4);
    game.load.spritesheet('bum1', 'imgs/b1.png', 36, 12, 1);
    game.load.spritesheet('bum2', 'imgs/b2.png', 12, 36, 1);
    game.load.spritesheet('block1','imgs/block1.png', 16,16, 1);
    game.load.spritesheet('block2','imgs/block2.png', 16,16, 1);
    game.load.spritesheet('block3','imgs/block3.png', 16, 16, 7);
    game.load.spritesheet('bonuses','imgs/bonuses.png', 16, 16, 14);
    game.load.spritesheet('door','imgs/door.png', 16, 16, 14);
}

function create() {
    setInterval(()=> {
        if (time-- == 0) {
            man.Die();
            time = 180;
        }
    },1000);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    walls = game.add.group();
    walls.enableBody = true;

    wallsBrocken = game.add.group();
    wallsBrocken.enableBody = true;

    bombsGroup = game.add.group();
    bombsGroup.enableBody = true;

    bumGroup = game.add.group();
    bumGroup.enableBody = true;

    mobGroup = game.add.group();
    mobGroup.enableBody = true;

    game.add.sprite(-100, -5, 'block1').scale.set(45, 2.6);
    door = game.add.sprite(0, 0, 'door');
    door.name = 'door';
    game.physics.enable(door, Phaser.Physics.ARCADE);
    door.body.setCircle(1);
    door.body.collideWorldBounds = true;
    door.body.immovable = true;
    game.world.sendToBack(door);
    
    bonus = game.add.sprite(0, 0, 'bonuses');
    bonus.name = 'bonus';
    game.physics.enable(bonus, Phaser.Physics.ARCADE);
    bonus.body.collideWorldBounds = true;
    bonus.body.setCircle(1);
    game.world.sendToBack(bonus);
    bonus.score = 1000;

    rect = new Phaser.Rectangle( 0, 0, 500, 500 );

    platform();
    newGame();
}

function mobCollide(_mob, spr) {
    _mob.collide();
    switch(spr.name) {
        case 'bum0':
            _mob.Die();
            break;
        case 'man':
            spr.Die();
            break;
    }
}
function manCollide(_man, spr) {
    switch(spr.name) {
        case 'bum0': 
            _man.Die();
            break;
        case 'bonus':
            bonus.check = true;
            bonus.x = -100;
            score += bonus.score;
            break;
        case 'door':
            if (bonus.check) {
                let i = 0;
                for (i = 0; i < mobs.length; i++) {
                    if (!mobs[i].die) {
                        return;
                    }
                }
                bonus.check = false;
                winLevel();
            }
            break;
    }
}

function update() {
    game.physics.arcade.collide(man, walls);
    game.physics.arcade.collide(man, wallsBrocken);
    game.physics.arcade.collide(man, bombsGroup);
    game.physics.arcade.collide(man, bumGroup);
    game.physics.arcade.collide(man, bonus);
    game.physics.arcade.collide(man, door);

    game.physics.arcade.collide(mobGroup, walls);
    game.physics.arcade.collide(mobGroup, wallsBrocken);
    game.physics.arcade.collide(mobGroup, man);
    game.physics.arcade.collide(mobGroup, bombsGroup);
    game.physics.arcade.collide(mobGroup, bumGroup);

    game.physics.arcade.collide(bumGroup, wallsBrocken);
    man.update();
}

function render() {
    if (isGame) {
        game.debug.text( `TIME  ${time}            ${score}             LEFT  ${man.lifes}`, 60, 20 );
    } else {
        game.debug.geom( rect, 'rgba(0,0,0,1)');
        game.debug.text( `STAGE ${stage}`, 210, 120 );
    }
}

function platform2() {
    let _mobsCount = mobsCount;
    let i, j, b = 0, 
        firstBonus = true,
        firstDoor = true,
        n = 0;
    let doorPosition = Math.floor(Math.random()*1000)%200;
    let bonusPosition = Math.floor(Math.random()*1000)%200;
    for (j = 0; j< 11; j++) {
        for (i = 0; i < 29; i++) {
            if (i%2 && j%2 || i<2 && j<2) {
                continue;
            }
            b = Math.random();
            if (b < 0.3) {
                if (n > doorPosition && firstDoor) {
                    door.x = i*16 + 16;
                    door.y = j*16 + 48;
                    firstDoor = false;
                } else {
                    if (n > bonusPosition && firstBonus) {                      
                        bonus.x = i*16 + 16;
                        bonus.y = j*16 + 48;
                        firstBonus = false;
                    }
                }
                blocks.push(buildBlock(wallsBrocken.create(i*16 + 16, j*16 + 48, 'block2')));
            } else {
                if (b > 0.92 && _mobsCount-->0) {
                    mobs.push(buildMob(mobGroup.create(i*16 + 16, j*16 + 48, 'mob1')));
                }
            }
            n++;
        }
    }
}

function platform() {
    let i = 0;
    let k = 0;
    
    for (i = 0; i < 31; i++) {
        walls.create(16*i, 32, 'block1').body.immovable = true;
    }
    for (i = 0; i < 31; i++) {
        walls.create(16*i, 224, 'block1').body.immovable = true;
    }
    for (i = 0; i < 11; i++) {
        walls.create(0, 16*i + 48, 'block1').body.immovable = true;
        walls.create(480, 16*i + 48, 'block1').body.immovable = true;
    }
    for (i = 0; i < 14; i++) {
        for (k = 0; k < 5; k++) {
            walls.create(32*i + 32, k*32 + 64, 'block1').body.immovable = true;
        }
    } 
}

/**
* @function buildMan Конструктор игрока
* @param {*} _man 
*/
function buildMan(_man) {
    _man.name = 'man';
    //Создается свойство speed. Максимальное значение 3, минимальное 0.5.
    Object.defineProperty(_man, "speed", { 
        set: function (val) {
            this._speed = val; 
            if (val < 0.5) this._speed = 0.5;
            if (val > 3) this._speed = 3;
        },
        get: function() { return this._speed || (this._speed = 0.5) }
    });
    //Создается свойство lifes. Минимальное 0, по умолчанию 3.
    Object.defineProperty(_man, "lifes", { 
        set: function (val) {
            this._life = val; 
            if (val < 0) this._life = 0;
        },
        get: function() { return this._life == undefined ? (this._life = 3): this._life }
    });
    //Анимация которая будут рисоваться при каждом действии.
    _man.animations.add("manWalkLeft", [0, 1, 2]);
    _man.animations.add("manWalkRight", [7, 8, 9]);
    _man.animations.add("manWalkDown", [3, 4, 5]);
    _man.animations.add("manWalkUp", [10, 11, 12]);
    _man.animations.add("manStop", [4]);
    _man.animations.add("manDie", [14, 15, 16, 17, 18, 19, 20, 6]);

    //Загрузка изначальной кортики.
    _man.animations.play('manStop', 10, false);
    //Движение в каждую сторону и запуск соответствующей анимации.
    _man.goLeft = function() {
        _man.body.velocity.setTo(-60, 0);
        _man.animations.play('manWalkLeft', 10, true);
    }
    _man.goRight = function() {
        _man.body.velocity.setTo(60, 0);
        _man.animations.play('manWalkRight', 10, true);
    }
    _man.goDown = function() {
        _man.body.velocity.setTo(0, 60);
        _man.animations.play('manWalkDown', 10, true);
    }
    _man.goUp = function() {
        _man.body.velocity.setTo(0, -60);
        _man.animations.play('manWalkUp', 10, true);
    }
    _man.stop = function() {
        _man.body.velocity.setTo(0, 0);
        _man.animations.play('manStop', 10, false);
    }
    //Подписка на события мыши.
    let leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    let rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    let upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    let downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(() => {
        if (_man.dropBomb && bombs.length < _man.skills.bombsStock && !_man.skills.die) {
            _man.dropBomb( {
                x: _man.x,
                y: _man.y
            });
        }
    }, this);

    game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
        if (_man.skills.isSapper && _man.blowUp && !_man.skills.die) {
            _man.blowUp();
        }
    });

    _man.update = function() {
        if (_man.skills.die) {
            return;
        }
        if (leftKey.isDown) {
            _man.goLeft();
        } else if (rightKey.isDown) {
            _man.goRight();
        } else if (upKey.isDown) {
            _man.goUp();
        } else if (downKey.isDown) {
            _man.goDown();
        } else {            
            _man.stop();            
        }
    }
    //callback
    _man.blowUp = null;
    _man.dropBomb = null;
    //Умирает
    _man.Die = function() {
        if (_man.skills.die) {
            return;
        }
        _man.lifes--;
        _man.body.velocity.setTo(0, 0);
        _man.animations.play('manDie', 10, false);
        _man.skills.die = true;
        setTimeout(() => {
            isGame = false;
            setTimeout(()=>{
                nextLevel();
                isGame = true;
            }, 3000);
           
        }, 3000);
    }
    //Оживает
    _man.comeToLife = function() {
        _man.skills.die = false;
        _man.animations.play('manStop', 10, false);
    }
    //Умения
    _man.skills = {
        //Кол. бомб который может поставить 
        get bombsStock() {
            return this._bomb || ( this._bomb = 1 );
        },
        set bombsStock(val = 1) {
            this._bomb = val < 1 ? 1: val;
        },
        //Умение самому взорвать бомбы по кнопке "X".
        isSapper: false,
        //Умение проходить сквозь стену
        isSpook: false,
        //Умение проходить сквозь бомбу
        isBypassBombs: false,
        //Бессмертие
        deathless: false,
        //Мертв
        die: false
    }
}

function buildBomb(bomb) {
    bomb.name = 'bomb';
    bomb.animations.add("bombLife", [1, 0, 2, 0]);
    bomb.animations.play('bombLife', 5, true);
}

function blowUp() {
    if (bombs[0]) {
        let bum = game.add.sprite(bombs[0].x - 16, bombs[0].y - 16, 'bum'); 
        let bum1 = bumGroup.create(bombs[0].x - 10, bombs[0].y + 2, 'bum1'); 
        let bum2 = bumGroup.create(bombs[0].x + 2, bombs[0].y - 10, 'bum2');

        bum.animations.add("bombBum", [0, 1, 2, 3, 2, 1, 0]);
        bum.animations.play('bombBum', 10, false);
        bum.name = 'bum';
        bum1.name = 'bum0';
        bum2.name = 'bum0';
        bum1.body.immovable = true;
        bum2.body.immovable = true;
        game.world.bringToTop(man);
        game.world.sendToBack(bum);

        bombs.shift().destroy();
        setInterval((_bum) => {
                _bum.destroy();
                bum1.destroy();
                bum2.destroy();
            },
            700,
            bum
        );
    }
}

function dropBomb(pos) {
    pos.x += 8;
    pos.y += 8;
    let posX = pos.x - pos.x % 16;
    let posY = pos.y - pos.y % 16;
    let i = 0;
    for (i = 0;i < bombs.length; i++) {
        if (bombs[i].x == posX && bombs[i].y == posY) {
            return;
        }
    }
    let bomb = bombsGroup.create(posX, posY, 'bomb');
    buildBomb(bomb);
    bomb.body.immovable = true;
    bombs.push(bomb);
    game.world.bringToTop(man);
    if (!man.skills.isSapper) {
        setTimeout(blowUp, 3000);
    }
}

function buildBlock(_block) {
    _block.name = 'block2';
    _block.body.immovable = true;
    _block.body.onCollide = new Phaser.Signal();
    _block.body.onCollide.add((_b, spr)=> {
        if (spr.name == 'bum0') {
            _b.break();
        }
    }, this);


    _block.break = function () {
        let _b = game.add.sprite(_block.x, _block.y, 'block3');
        game.physics.enable(_b, Phaser.Physics.ARCADE);
        _b.body.collideWorldBounds = true;

        _b.body.immovable = true;
        _b.animations.add('break', [1, 2, 3, 4, 5, 6]);
        _b.animations.play('break', 10, false);
        _block.destroy();
        setTimeout(()=>{
            _b.destroy();
        },500);
    }
    return _block;
}

/**
* @function buildMob Конструктор бота
* @param {*} _mob
*/
function buildMob(_mob) {
    _mob.body.onCollide = new Phaser.Signal();
    _mob.body.onCollide.add(mobCollide, this);
    _mob.name = 'mob'
    _mob.die = false;
    _mob.score = 100;
    //Создается свойство speed. Максимальное значение 3, минимальное 0.5.
    Object.defineProperty(_mob, "speed", { 
        set: function (val) {
            this._speed = val; 
            if (val < 40) this._speed = 40;
            if (val > 70) this._speed = 70;
        },
        get: function() { return this._speed || (this._speed = 40) }
    });

    //Анимация которая будут рисоваться при каждом действии.
    _mob.animations.add("mobWalkLeft", [3, 4, 5]);
    _mob.animations.add("mobWalkRight", [0, 1, 2]);
    _mob.animations.add("mobDie", [7, 8, 9, 10]);

    //Загрузка изначальной кортики.
    _mob.animations.play('mobWalkLeft', 8, true);
    //Движение в каждую сторону и запуск соответствующей анимации.
    _mob.goLeft = function() {
        _mob.body.velocity.setTo(-_mob.speed, 0);
        _mob.animations.play('mobWalkLeft', 8, true);
    }
    _mob.goRight = function() {
        _mob.body.velocity.setTo(_mob.speed, 0);
        _mob.animations.play('mobWalkRight', 8, true);
    }
    _mob.goDown = function() {
        _mob.body.velocity.setTo(0, _mob.speed);
    }
    _mob.goUp = function() {
        _mob.body.velocity.setTo(0, -_mob.speed);
    }

    _mob.update = function() {
        if(_mob.die){
            return;
        }
        let probability = 0.001;        
        if (Math.random() < probability) {
            _mob.goLeft();
        } else if (Math.random() < probability) {
            _mob.goRight();
        } else if (Math.random() < probability) {
            _mob.goUp();
        } else if (Math.random() < probability) {
            _mob.goDown();
        } 
    }

    _mob.collide = function() {
        if(_mob.die){
            return;
        }
        //console.log(_mob.body.touching);
        if (Math.random() < 0.4) {
            _mob.goLeft();
        } else if (Math.random() < 0.4) {
            _mob.goRight();
        } else if (Math.random() < 0.4) {
            _mob.goUp();
        } else {
            _mob.goDown();
        }
    }

    //Умирает
    _mob.Die = function() {
        if (_mob.die) {
            return;
        }
        _mob.die = true;
        _mob.animations.play('mobDie', 10, false);
        _mob.die = true;
        _mob.body.velocity.setTo(0, 0);
        score += _mob.score;
        setTimeout(()=>{
            _mob.destroy();
        },1000)
    }
    _mob.goRight();
    return _mob;

}

function newGame() {
    if (man && man.destroy) {
        man.destroy();
    }
    man = game.add.sprite(16, 48, 'man');
    game.physics.enable(man, Phaser.Physics.ARCADE);
    man.body.collideWorldBounds = true;
    man.body.setCircle(8);
    man.body.onCollide = new Phaser.Signal();
    man.body.onCollide.add(manCollide, this);
    
    //Создается игрок, происходить инициализация и привязка всех методов.
    buildMan(man);
    game.world.bringToTop(walls);
    man.blowUp = blowUp;
    man.dropBomb = dropBomb;
    man.lifes = 3;
    score = 0;
    stage = 1;
    nextLevel();
}

function nextLevel() {
    if (man.lifes == 0) {
        alert('Game over');
        newGame();
        return;
    }
    let i;
    for (i = 0; i < blocks.length; i++) {
        if (blocks[i].destroy) {
            blocks[i].destroy();
        }
    }
    for (i = 0; i < mobs.length; i++) {
        if (mobs[i].destroy) {
            mobs[i].destroy();
        }
    }
    for (i = 0; i < bombs.length; i++) {
        if (bombs[i].destroy) {
            bombs[i].destroy();
        }
    }
    time = 180;
    blocks = [];
    mobs = [];
    platform2();
    man.x = 16;
    man.y = 48;
    man.comeToLife();
}

function winLevel() {
    stage++;
    man.lifes++;
    isGame = false;
    setTimeout(()=> {
        isGame = true;
    }, 3000);
    nextLevel();
}
