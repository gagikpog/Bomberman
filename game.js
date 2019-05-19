//Создание и инициализация окна. Далле все обрашение к игре происходит через переменную game.
let game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update,
    render: render
});
var man;
var bombs = [];
var mob1;
var walls;
var wallsBrocken;

function preload() {
game.stage.backgroundColor = '#1F8B00';
    game.load.spritesheet('man', 'imgs/man.png', 16, 16, 21);
    game.load.spritesheet('mob1', 'imgs/mob1.png', 16, 16, 11);
    game.load.spritesheet('bomb', 'imgs/bomb.png', 16, 16, 3);
    game.load.spritesheet('bum', 'imgs/bum.png', 48, 48, 5);
    game.load.spritesheet('block1','imgs/block1.png', 16,16, 1);
    game.load.spritesheet('block2','imgs/block2.png', 16,16, 1);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    walls = game.add.group();
    walls.enableBody = true;

    wallsBrocken = game.add.group();
    wallsBrocken.enableBody = true;

    platform2();
    platform();
    man = game.add.sprite(16, 48, 'man');
    game.physics.enable(man, Phaser.Physics.ARCADE);
    man.body.collideWorldBounds = true;
    man.body.setCircle(8);
    

    mob1 = game.add.sprite(16, 96, 'mob1');
    game.physics.enable(mob1, Phaser.Physics.ARCADE);
    mob1.body.collideWorldBounds = true;
    


    //Создается игрок, происходить инициализация и привязка всех методов.
    buildMan(man);
    buildMob(mob1);
    game.world.bringToTop(walls);
    man.blowUp = blowUp;
    man.dropBomb = dropBomb;
}

function update() {
    game.physics.arcade.collide(man,walls);
    game.physics.arcade.collide(man,wallsBrocken);
    man.update();
    mob1.update();
}

function render() {
	//game.debug.bodyInfo(mob1, 16, 24);
}

function platform2() {
    // game.add.sprite(16, 32, 'block2');
    let i = 80, x, y;
    while (--i) {
        y = Math.random()*1000%(16*10) + 48;
        x = Math.random()*1000%464 + 16;
        y -= y%16;
        x -= x%16;
        if(x < 64 && y < 80) {
            continue;
        }
        wallsBrocken.create(x, y, 'block2').body.immovable = true;

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
        if (_man.dropBomb && bombs.length < _man.skills.bombsStock) {
            _man.dropBomb( {
                x: _man.x,
                y: _man.y
            });
        }
    }, this);

    game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
        if (_man.skills.isSapper && _man.blowUp) {
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
        _man.lifes--;
        _man.animations.play('manDie', 10, false);
        _man.skills.die = true;
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
    bomb.animations.add("bombLife", [1, 0, 2, 0]);
    bomb.animations.play('bombLife', 5, true);
    bomb.bum = function() {
        //alert("bum");
        bomb.animations.play('bombBum', 5, false);
    }
}

function blowUp() {
    if (bombs[0]) {
        let bum = game.add.sprite(bombs[0].x-16, bombs[0].y-16, 'bum');
        bum.animations.add("bombBum", [0, 1, 2, 3, 2, 1, 0]);
        bum.animations.play('bombBum', 10, false);
        game.world.bringToTop(man);
        game.world.sendToBack(bum);

        bombs[0].bum();
        bombs.shift().destroy();
        setInterval((bomb) => {
                bomb.destroy();
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
    let bomb = game.add.sprite(posX, posY, 'bomb');
    buildBomb(bomb);
    bombs.push(bomb);
    game.world.bringToTop(man);
    if (!man.skills.isSapper) {
        setTimeout(blowUp, 3000);
    }
}

/**
* @function buildMob Конструктор бота
* @param {*} _mob
*/
function buildMob(_mob) {
    //Создается свойство speed. Максимальное значение 3, минимальное 0.5.
    Object.defineProperty(_mob, "speed", { 
        set: function (val) {
            this._speed = val; 
            if (val < 0.5) this._speed = 0.5;
            if (val > 3) this._speed = 3;
        },
        get: function() { return this._speed || (this._speed = 0.5) }
    });

    //Анимация которая будут рисоваться при каждом действии.
    _mob.animations.add("mobWalkLeft", [0, 1, 2]);
    _mob.animations.add("mobWalkRight", [3, 4, 5]);
    _mob.animations.add("mobDie", [7, 8, 9, 10]);

    //Загрузка изначальной кортики.
    _mob.animations.play('mobWalkLeft', 10, true);
    //Движение в каждую сторону и запуск соответствующей анимации.
    _mob.goLeft = function() {
        _mob.x -= _mob.speed;
        _mob.animations.play('mobWalkLeft', 10, true);
    }
    _mob.goRight = function() {
        _mob.x +=  _mob.speed;
        _mob.animations.play('mobWalkRight', 10, true);
    }
    _mob.goDown = function() {
        _mob.y += _mob.speed;
        _mob.animations.play('mobWalkDown', 10, true);
    }
    _mob.goUp = function() {
        _mob.y -= _mob.speed;
        _mob.animations.play('mobWalkUp', 10, true);
    }

    _mob.update = function() {
        if (leftKey.isDown) {
            _mob.goLeft();
        } else if (rightKey.isDown) {
            _mob.goRight();
        } else if (upKey.isDown) {
            _mob.goUp();
        } else if (downKey.isDown) {
            _mob.goDown();
        }            
    }

    //Умирает
    _mob.Die = function() {
        _mob.animations.play('mobDie', 10, false);
    }
}
