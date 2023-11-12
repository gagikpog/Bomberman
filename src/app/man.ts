import Phaser from 'phaser-ce';
import { IGame, IMan } from './interfaces';

export class Man implements IMan {

    public lives = 3;

    private name;
    private _life;
    private _speed;
    private _game: IGame;
    private _target: Phaser.Sprite;
    private _keyboard;
    private _die = false;

    get target(): Phaser.Sprite {
        return this._target;
    }

    // Умения
    private _skills = {
        // Кол. бомб который может поставить
        bombsStock: 1,
        // Умение самому взорвать бомбы по кнопке "X".
        isSapper: false,
        // Умение проходить сквозь стену
        isSpook: false,
        // Умение проходить сквозь бомбу
        isBypassBombs: false,
        // Бессмертие
        deathless: false,
    };

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
        this._target = this._game.engine.add.sprite(16, 16, 'man');
        this._game.engine.physics.arcade.enable(this._target);

        this._target.name = 'man';
        this.name = 'man';

        this._target.body.collideWorldBounds = true;
        this._target.body.setCircle(8);
        this._target.body.onCollide = new Phaser.Signal();
        this._target.body.onCollide.add(this._collideHandler, this);

        this._initSprites();

        // Подписка на события мыши.
        this._keyboard = {
            leftKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            rightKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            upKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.UP),
            downKey: this._game.engine.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        };
    }

    destroy(): void {
        this._target.destroy();
        this._target = void 0;
    }

    // Умирает
    die(): void {
        if (this._die || this._skills.deathless) {
            return;
        }
        this.lives--;
        this._target.body.velocity.setTo(0, 0);
        this._target.animations.play('manDie', 10, false);
        this._die = true;
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
        this._die = false;
        this._target.x = 16;
        this._target.y = 16;
        this._target.animations.play('manStop', 10, false);
    }

    update() {
        if (this._die) {
            return;
        }
        if (this._keyboard.leftKey.isDown) {
            this._goLeft();
        } else if (this._keyboard.rightKey.isDown) {
            this._goRight();
        } else if (this._keyboard.upKey.isDown) {
            this._goUp();
        } else if (this._keyboard.downKey.isDown) {
            this._goDown();
        } else {
            this._stop();
        }
    }

    dropBomb() {
        if (this._game.bombs.length < this._skills.bombsStock && !this._die) {
            const x = this._target.x + 8;
            const y = this._target.y + 8;

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
            this._game.engine.world.bringToTop(this._target);
            if (!this._skills.isSapper) {
                setTimeout(() => {
                    this._blowUp();
                }, 3000);
            }
        }

    }

    blowUp() {
        if (this._skills.isSapper) {
            this._blowUp();
        }
    }

    // Движение в каждую сторону и запуск соответствующей анимации.
    private _goLeft() {
        this._target.body.velocity.setTo(-60, 0);
        this._target.animations.play('manWalkLeft', 10, true);
    }

    private _goRight() {
        this._target.body.velocity.setTo(60, 0);
        this._target.animations.play('manWalkRight', 10, true);
    }

    private _goDown() {
        this._target.body.velocity.setTo(0, 60);
        this._target.animations.play('manWalkDown', 10, true);
    }

    private _goUp() {
        this._target.body.velocity.setTo(0, -60);
        this._target.animations.play('manWalkUp', 10, true);
    }

    private _stop() {
        this._target.body.velocity.setTo(0, 0);
        this._target.animations.play('manStop', 10, false);
    }


    private _blowUp() {
        if (!this._die && this._game.bombs[0]) {
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
            this._game.engine.world.bringToTop(this._target);
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

    private _initSprites(): void {
        // Анимация которая будут рисоваться при каждом действии.
        this._target.animations.add('manWalkLeft', [0, 1, 2]);
        this._target.animations.add('manWalkRight', [7, 8, 9]);
        this._target.animations.add('manWalkDown', [3, 4, 5]);
        this._target.animations.add('manWalkUp', [10, 11, 12]);
        this._target.animations.add('manStop', [4]);
        this._target.animations.add('manDie', [14, 15, 16, 17, 18, 19, 20, 6]);

        // Загрузка изначальной кортики.
        this._target.animations.play('manStop', 10, false);
    }

    private _collideHandler = (_man, spr) => {
        switch(spr.name) {
        case 'mob':
        case 'bum0':
            this.die();
            break;
        case 'bonus':
            if (this._game.bonus.canDestroy()) {
                this._game.score += this._game.bonus.score;
                this._game.bonus.destroy();
            }
            break;
        case 'door':
            if (this._game.bonus.destroyed && this._game.door.opened()) {
                const allMobsDied = this._game.mobs.every((mob) => mob.die);
                if (allMobsDied) {
                    this._game.winLevel();
                }
            }
            break;
        }
    };
}
