
/**
* @function buildMan Конструктор игрока
*/
window.buildMan = function() {
    const _man = new Man();

    myGame.engine.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(() => {
        if (myGame.bombs.length < _man.skills.bombsStock && !_man.skills.die) {
            _man.dropBomb({
                x: _man.target.x,
                y: _man.target.y
            });
        }
    });

    myGame.engine.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
        if (_man.skills.isSapper && !_man.skills.die) {
            _man.blowUp();
        }
    });

    return _man;
}

class Man {
    // Умения
    skills = {
        // Кол. бомб который может поставить 
        get bombsStock() {
            return this._bomb || ( this._bomb = 1 );
        },
        set bombsStock(val = 1) {
            this._bomb = val < 1 ? 1: val;
        },
        // Умение самому взорвать бомбы по кнопке "X".
        isSapper: false,
        // Умение проходить сквозь стену
        isSpook: false,
        // Умение проходить сквозь бомбу
        isBypassBombs: false,
        // Бессмертие
        deathless: false,
        // FIXME: мертв - это не умение, это состояние.
        // Мертв
        die: false
    }

    // Создается свойство lives. Минимальное 0, по умолчанию 3.
    get lives() {
        return this._life === void 0 ? (this._life = 3): this._life;
    }

    set lives(val) {
        this._life = val;
        if (val < 0) {
            this._life = 0
        };
    }

    // Создается свойство speed. Максимальное значение 3, минимальное 0.5.
    get speed() {
        return this._speed === void 0 ? (this._speed = 0.5) : this._speed;
    }

    set speed(val) {
        this._speed = val;
        if (val < 0.5) {
            this._speed = 0.5;
        }

        if (val > 3) {
            this._speed = 3;
        }
    }

    constructor() {
        this.target = myGame.engine.add.sprite(16, 48, 'man');
        myGame.engine.physics.enable(this.target, Phaser.Physics.ARCADE);

        this.target.name = 'man';
        this.name = 'man';

        this.target.body.collideWorldBounds = true;
        this.target.body.setCircle(8);
        this.target.body.onCollide = new Phaser.Signal();
        this.target.body.onCollide.add(this.collideHandler, this);

        this._initSprites();

        // Подписка на события мыши.
        this.keyboard = {
            leftKey: myGame.engine.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            rightKey: myGame.engine.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            upKey: myGame.engine.input.keyboard.addKey(Phaser.Keyboard.UP),
            downKey: myGame.engine.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        };
    }

    destroy() {
        this.target.destroy();
        this.target = void 0;
    }

    _initSprites() {
        // Анимация которая будут рисоваться при каждом действии.
        this.target.animations.add("manWalkLeft", [0, 1, 2]);
        this.target.animations.add("manWalkRight", [7, 8, 9]);
        this.target.animations.add("manWalkDown", [3, 4, 5]);
        this.target.animations.add("manWalkUp", [10, 11, 12]);
        this.target.animations.add("manStop", [4]);
        this.target.animations.add("manDie", [14, 15, 16, 17, 18, 19, 20, 6]);

        // Загрузка изначальной кортики.
        this.target.animations.play('manStop', 10, false);
    }

    // Умирает
    Die() {
        if (this.skills.die || this.skills.deathless) {
            return;
        }
        this.lives--;
        this.target.body.velocity.setTo(0, 0);
        this.target.animations.play('manDie', 10, false);
        this.skills.die = true;
        setTimeout(() => {
            myGame.isGame = false;
            setTimeout(()=>{
                nextLevel();
                myGame.isGame = true;
            }, 3000);
           
        }, 3000);
    }

    // Оживает
    comeToLife() {
        this.skills.die = false;
        this.target.animations.play('manStop', 10, false);
    }

    update() {
        if (this.skills.die) {
            return;
        }
        if (this.keyboard.leftKey.isDown) {
            this.goLeft();
        } else if (this.keyboard.rightKey.isDown) {
            this.goRight();
        } else if (this.keyboard.upKey.isDown) {
            this.goUp();
        } else if (this.keyboard.downKey.isDown) {
            this.goDown();
        } else {
            this.stop();
        }
    }

     // Движение в каждую сторону и запуск соответствующей анимации.
    goLeft() {
        this.target.body.velocity.setTo(-60, 0);
        this.target.animations.play('manWalkLeft', 10, true);
    }

    goRight() {
        this.target.body.velocity.setTo(60, 0);
        this.target.animations.play('manWalkRight', 10, true);
    }

    goDown() {
        this.target.body.velocity.setTo(0, 60);
        this.target.animations.play('manWalkDown', 10, true);
    }

    goUp() {
        this.target.body.velocity.setTo(0, -60);
        this.target.animations.play('manWalkUp', 10, true);
    }

    stop() {
        this.target.body.velocity.setTo(0, 0);
        this.target.animations.play('manStop', 10, false);
    }

    dropBomb(pos) {
        pos.x += 8;
        pos.y += 8;
        let posX = pos.x - pos.x % 16;
        let posY = pos.y - pos.y % 16;
        let i = 0;
        for (i = 0;i < myGame.bombs.length; i++) {
            if (myGame.bombs[i].x == posX && myGame.bombs[i].y == posY) {
                return;
            }
        }
        let bomb = myGame.groups.bombsGroup.create(posX, posY, 'bomb');
        buildBomb(bomb);
        bomb.body.immovable = true;
        myGame.bombs.push(bomb);
        myGame.engine.world.bringToTop(this.target);
        if (!this.skills.isSapper) {
            setTimeout(this.blowUp, 3000);
        }
    }

    blowUp = () => {
        if (myGame.bombs[0]) {
            const bum = myGame.engine.add.sprite(myGame.bombs[0].x - 16, myGame.bombs[0].y - 16, 'bum');
            const bum1 = myGame.groups.bumGroup.create(myGame.bombs[0].x - 10, myGame.bombs[0].y + 2, 'bum1');
            const bum2 = myGame.groups.bumGroup.create(myGame.bombs[0].x + 2, myGame.bombs[0].y - 10, 'bum2');

            bum.animations.add("bombBum", [0, 1, 2, 3, 2, 1, 0]);
            bum.animations.play('bombBum', 10, false);
            bum.name = 'bum';
            bum1.name = 'bum0';
            bum2.name = 'bum0';
            bum1.body.immovable = true;
            bum2.body.immovable = true;
            myGame.engine.world.bringToTop(this.target);
            myGame.engine.world.sendToBack(bum);

            myGame.bombs.shift().destroy();
            setTimeout(() => {
                    bum.destroy();
                    bum1.destroy();
                    bum2.destroy();
                },
                700
            );
        }
    }

    collideHandler = (_man, spr) => {

        switch(spr.name) {
            case 'mob':
            case 'bum0':
                this.Die();
                break;
            case 'bonus':
                myGame.bonus.check = true;
                myGame.bonus.x = -100;
                myGame.score += myGame.bonus.score;
                break;
            case 'door':
                if (myGame.bonus.check) {
                    let i = 0;
                    for (i = 0; i < myGame.mobs.length; i++) {
                        if (!myGame.mobs[i].die) {
                            return;
                        }
                    }

                    myGame.bonus.check = false;
                    winLevel();
                }
                break;
        }
    
    }
}
