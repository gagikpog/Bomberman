//Создание и инициализация окна. Далле все обрашение к игре происходит через переменную game.
let game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update
});
var man;
var bombs = [];
var mob1 = [];

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
    platform2();
    platform();
    man = game.add.sprite(16, 48, 'man');
    mob1 = game.add.sprite(Math.random()*5, Math.random()*5, 'mob1');
    //Создается игрок, происходить инициализация и привязка всех методов.
    buildMan(man);
    while(true)
    {
        setTimeout(buildMob(mob1), 10000);
    }
    
    man.blowUp = blowUp;
    man.dropBomb = dropBomb;
}

function update() {
    man.update();
    mob1.update();
}

function platform2(){
    game.add.sprite(16,32,'block2');
    let i=80,x,y;
    while(--i){
        y=Math.random()*1000%(16*10)+48;
        x=Math.random()*1000%464+16;
        y-=y%16;
        x-=x%16;
        if(x<64 && y<80){
            continue;
        }
        game.add.sprite(x,y,'block2');
    }
}
function platform(){
    let i=0;
    let k=0;
    
    for(i=0; i<31; i++){
        game.add.sprite(16*i,32,'block1');
    }
    for(i=0; i<31; i++){
        game.add.sprite(16*i,223,'block1');
    }
    for(i=0; i<11; i++){
        game.add.sprite(0,16*i+48,'block1');
        game.add.sprite(480, 16*i+48,'block1');
    }
    for(i=0; i<14; i++){
        for(k=0; k<5; k++){
            game.add.sprite(32*i+32,k*32+64,'block1');
            //game.add.sprite(16*i,k*16+32,'block1');
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
    _man.animations.add("manDie", [14, 15, 16, 17, 18, 19, 20]);

    //Загрузка изначальной кортики.
    _man.animations.play('manStop', 10, false);
    //Движение в каждую сторону и запуск соответствующей анимации.
    _man.goLeft = function() {
        _man.x -= _man.speed;
        _man.animations.play('manWalkLeft', 10, true);
    }
    _man.goRight = function() {
        _man.x += _man.speed;
        _man.animations.play('manWalkRight', 10, true);
    }
    _man.goDown = function() {
        _man.y += _man.speed;
        _man.animations.play('manWalkDown', 10, true);
    }
    _man.goUp = function() {
        _man.y -= _man.speed;
        _man.animations.play('manWalkUp', 10, true);
    }
    _man.stop = function() {
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
    bomb.animations.add("bombLife", [0, 1, 2]);
    bomb.animations.play('bombLife', 5, true);
    bomb.bum = function() {
        //alert("bum");
        bomb.animations.play('bombBum', 20, false);
    }
}

function blowUp() {
    if (bombs[0]) {
        let bum = game.add.sprite(bombs[0].x-16, bombs[0].y-16, 'bum');
        bum.animations.add("bombBum", [0, 1, 2, 3, 2, 1, 0]);
        bum.animations.play('bombBum', 10, false);
        game.world.bringToTop(man);

        bombs[0].bum();
        bombs.shift().destroy();
        setInterval((bomb) => {
                bomb.destroy();
            },
            900,
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
    _mob.animations.add("mobWalkDown", [0, 1, 2]);
    _mob.animations.add("mobWalkUp", [3, 4, 5]);
    _mob.animations.add("mobDie", [7, 8, 9, 10, 11]);

    //Загрузка изначальной кортики.
    _mob.animations.play('mobWalkLeft', 10, false);
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

    
        /*/TODO: придумать условия смены направления движения
        if () {
            _mob.goLeft();
        } else if () {
            _mob.goRight();
        } else if () {
        _mob.goUp();
        } else if () {
            _mob.goDown();
        } else {            
            _mob.stop();            
        }
        /*/
    
    //Умирает
    _mob.Die = function() {
        _mob.animations.play('mobDie', 10, false);
    }
}