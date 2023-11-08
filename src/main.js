import { Game } from './game';
import { Man } from './man';

//Создание и инициализация окна. Далее все обращение к игре происходит через переменную game.
window.myGame = new Game();

function mobCollide(_mob, spr) {
    _mob.collide();
    switch(spr.name) {
        case 'bum0':
            _mob.Die();
            break;
    }
}


function platform2() {
    let _mobsCount = myGame.mobsCount;
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
                    myGame.groups.door.x = i*16 + 16;
                    myGame.groups.door.y = j*16 + 48;
                    firstDoor = false;
                } else {
                    if (n > bonusPosition && firstBonus) {
                        myGame.bonus.x = i*16 + 16;
                        myGame.bonus.y = j*16 + 48;
                        firstBonus = false;
                    }
                }
                myGame.blocks.push(buildBlock(myGame.groups.wallsBrocken.create(i*16 + 16, j*16 + 48, 'block2')));
            } else {
                if (b > 0.92 && _mobsCount-->0) {
                    myGame.mobs.push(buildMob(myGame.groups.mobGroup.create(i*16 + 16, j*16 + 48, 'mob1')));
                }
            }
            n++;
        }
    }
}

window.buildBomb = function(bomb) {
    bomb.name = 'bomb';
    bomb.animations.add("bombLife", [1, 0, 2, 0]);
    bomb.animations.play('bombLife', 5, true);
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
        let _b = myGame.engine.add.sprite(_block.x, _block.y, 'block3');
        myGame.engine.physics.enable(_b, Phaser.Physics.ARCADE);
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
        myGame.score += _mob.score;
        setTimeout(()=>{
            _mob.destroy();
        },1000)
    }
    _mob.goRight();
    return _mob;

}

window.newGame = function() {
    if (myGame.player) {
        myGame.player.destroy();
    }

    //Создается игрок, происходить инициализация и привязка всех методов.
    myGame.player = buildMan();
    myGame.engine.world.bringToTop(myGame.groups.walls);

    myGame.score = 0;
    myGame.stage = 1;
    nextLevel();
}

window.nextLevel = function() {
    if (myGame.player.lives == 0) {
        alert('Game over');
        newGame();
        return;
    }
    let i;
    for (i = 0; i < myGame.blocks.length; i++) {
        if (myGame.blocks[i].destroy) {
            myGame.blocks[i].destroy();
        }
    }
    for (i = 0; i < myGame.mobs.length; i++) {
        if (myGame.mobs[i].destroy) {
            myGame.mobs[i].destroy();
        }
    }
    for (i = 0; i < myGame.bombs.length; i++) {
        if (myGame.bombs[i].destroy) {
            myGame.bombs[i].destroy();
        }
    }
    myGame.time = 180;
    myGame.blocks = [];
    myGame.mobs = [];
    platform2();
    myGame.player.target.x = 16;
    myGame.player.target.y = 48;
    myGame.player.comeToLife();
}

function winLevel() {
    myGame.stage++;
    myGame.player.lives++;
    myGame.isGame = false;
    setTimeout(()=> {
        myGame.isGame = true;
    }, 3000);
    nextLevel();
}
