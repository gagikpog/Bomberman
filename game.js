//Создание и инициализация окна. Далле все обрашение к игре происходит через переменную game.
let game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
        preload: preload,
        create: create,
        update: update
});
var man;

function preload() {
    game.stage.backgroundColor = '#1F8B00';
    game.load.spritesheet('man', 'imgs/man.png', 16, 16, 21);
}

function create() {
    man = game.add.sprite(14, 16, 'man');
    //Создается игрок, происходить инициализация и привязка всех методов.
    buildMan(man);
}

function update() {
    man.update();
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
            if(val < 0.5) this._speed = 0.5;
            if(val > 3) this._speed = 3;
        },
        get: function(){ return this._speed || (this._speed = 0.5) }
    });
    //Создается свойство lifes. Минимальное 0, по умолчанию 3.
    Object.defineProperty(_man, "lifes", { 
        set: function (val) {
            this._life = val; 
            if(val < 0) this._life = 0;
        },
        get: function(){ return this._life == undefined ? (this._life = 3): this._life }
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
    let keyC = game.input.keyboard.addKey(Phaser.Keyboard.C);
    let keyX = game.input.keyboard.addKey(Phaser.Keyboard.X);
    _man.update = function() {
        if(_man.skills.die) {
            return;
        }
        if(leftKey.isDown) {
            _man.goLeft();
        } else if(rightKey.isDown) {
            _man.goRight();
        } else if(upKey.isDown) {
            _man.goUp();
        } else if(downKey.isDown) {
            _man.goDown();
        } else {            
            _man.stop();            
        }
        if(keyC.isDown && _man.dropBomb){
            _man.dropBomb({
                x: _man.x,
                y: _man.y
            });
        }
        if(keyX.isDown && _man.skills.isSapper && _man.blowUp){
            _man.blowUp();
        }
    }
    //Умирает
    _man.Die = function(){
        _man.lifes--;
        _man.animations.play('manDie', 10, false);
        _man.skills.die = true;
    }
    //Оживает
    _man.comeToLife = function(){
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