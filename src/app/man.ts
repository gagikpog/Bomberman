import Phaser from 'phaser-ce';
import { IGame, IMan } from './interfaces';

export class Man implements IMan {

    private _life;
    private _speed;
    private _game: IGame;

    private target;
    private keyboard;
    private name;

    // Умения
    private skills = {
        // Кол. бомб который может поставить
        get bombsStock() {
            return this._bomb || ( this._bomb = 1);
        },
        set bombsStock(val) {
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
    };

    // Создается свойство lives. Минимальное 0, по умолчанию 3.
    get lives() {
        return this._life === void 0 ? (this._life = 3): this._life;
    }

    set lives(val) {
        this._life = val;
        if (val < 0) {
            this._life = 0;
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

    constructor(game: IGame) {
        this._game = game;
        this.target = this._game.engine.add.sprite(16, 48, 'man');
        this._game.engine.physics.enable(this.target, Phaser.Physics.ARCADE);

        this.target.name = 'man';
        this.name = 'man';

        this.target.body.collideWorldBounds = true;
        this.target.body.setCircle(8);
        this.target.body.onCollide = new Phaser.Signal();
        this.target.body.onCollide.add(this._collideHandler, this);

        this._initSprites();

        // Подписка на события мыши.
        this.keyboard = {
            leftKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            rightKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            upKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.UP),
            downKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        };
    }

    destroy() {
        this.target.destroy();
        this.target = void 0;
    }

    _initSprites() {
        // Анимация которая будут рисоваться при каждом действии.
        this.target.animations.add('manWalkLeft', [0, 1, 2]);
        this.target.animations.add('manWalkRight', [7, 8, 9]);
        this.target.animations.add('manWalkDown', [3, 4, 5]);
        this.target.animations.add('manWalkUp', [10, 11, 12]);
        this.target.animations.add('manStop', [4]);
        this.target.animations.add('manDie', [14, 15, 16, 17, 18, 19, 20, 6]);

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
            this._game.isGame = false;
            setTimeout(()=>{
                this._game.nextLevel();
                this._game.isGame = true;
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

    dropBomb() {
        if (this._game.bombs.length < this.skills.bombsStock && !this.skills.die) {
            const x = this.target.x + 8;
            const y = this.target.y + 8;

            const posX = x - x % 16;
            const posY = y - y % 16;
            let i = 0;
            for (i = 0;i < this._game.bombs.length; i++) {
                if (this._game.bombs[i].x === posX && this._game.bombs[i].y === posY) {
                    return;
                }
            }
            const bomb = this._game.groups.bombsGroup.create(posX, posY, 'bomb');

            bomb.name = 'bomb';
            bomb.animations.add('bombLife', [1, 0, 2, 0]);
            bomb.animations.play('bombLife', 5, true);
            bomb.body.immovable = true;

            this._game.bombs.push(bomb);
            this._game.engine.world.bringToTop(this.target);
            if (!this.skills.isSapper) {
                setTimeout(() => {
                    this._blowUp();
                }, 3000);
            }
        }

    }

    blowUp() {
        if (this.skills.isSapper) {
            this._blowUp();
        }
    }

    _blowUp() {
        if (!this.skills.die && this._game.bombs[0]) {
            const bum = this._game.engine.add.sprite(this._game.bombs[0].x - 16, this._game.bombs[0].y - 16, 'bum');
            const bum1 = this._game.groups.bumGroup.create(this._game.bombs[0].x - 10, this._game.bombs[0].y + 2, 'bum1');
            const bum2 = this._game.groups.bumGroup.create(this._game.bombs[0].x + 2, this._game.bombs[0].y - 10, 'bum2');

            bum.animations.add('bombBum', [0, 1, 2, 3, 2, 1, 0]);
            bum.animations.play('bombBum', 10, false);
            bum.name = 'bum';
            bum1.name = 'bum0';
            bum2.name = 'bum0';
            bum1.body.immovable = true;
            bum2.body.immovable = true;
            this._game.engine.world.bringToTop(this.target);
            this._game.engine.world.sendToBack(bum);

            const bomb = this._game.bombs.shift();
            bomb.destroy();
            setTimeout(() => {
                bum.destroy();
                bum1.destroy();
                bum2.destroy();
            }, 700);
        }
    }

    private _collideHandler = (_man, spr) => {

        switch(spr.name) {
        case 'mob':
        case 'bum0':
            this.Die();
            break;
        case 'bonus':
            this._game.score += this._game.bonus.score;
            this._game.bonus.destroy();
            break;
        case 'door':
            if (this._game.bonus.destroy) {
                const allMobsDied = this._game.mobs.every((mob) => mob.die);
                if (allMobsDied) {
                    this._game.winLevel();
                }
            }
            break;
        }
    };
}
