import Phaser from 'phaser-ce';
import { Game } from './game';
import { buildMob } from './mob';
import { newGame } from './utility';

// Создание и инициализация окна. Далее все обращение к игре происходит через переменную game.
window.myGame = new Game();

function platform2() {
    let _mobsCount = myGame.mobsCount;
    let i, j, b = 0,
        firstBonus = true,
        firstDoor = true,
        n = 0;
    const doorPosition = Math.floor(Math.random()*1000)%200;
    const bonusPosition = Math.floor(Math.random()*1000)%200;
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
                if (b > 0.92 && _mobsCount-- > 0) {
                    myGame.mobs.push(buildMob(myGame.groups.mobGroup.create(i*16 + 16, j*16 + 48, 'mob1')));
                }
            }
            n++;
        }
    }
}

window.buildBomb = function(bomb) {
    bomb.name = 'bomb';
    bomb.animations.add('bombLife', [1, 0, 2, 0]);
    bomb.animations.play('bombLife', 5, true);
}

function buildBlock(_block) {
    _block.name = 'block2';
    _block.body.immovable = true;
    _block.body.onCollide = new Phaser.Signal();
    _block.body.onCollide.add((_b, spr)=> {
        if (spr.name === 'bum0') {
            _b.break();
        }
    }, this);


    _block.break = function () {
        const _b = myGame.engine.add.sprite(_block.x, _block.y, 'block3');
        myGame.engine.physics.enable(_b, Phaser.Physics.ARCADE);
        _b.body.collideWorldBounds = true;

        _b.body.immovable = true;
        _b.animations.add('break', [1, 2, 3, 4, 5, 6]);
        _b.animations.play('break', 10, false);
        _block.destroy();
        setTimeout(()=>{
            _b.destroy();
        }, 500);
    };

    return _block;
}


window.nextLevel = function() {
    if (myGame.player.lives === 0) {
        alert('Game over');
        newGame(myGame);
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
};
