import { Sprite, Keyboard } from 'phaser-ce';
import { IPowerUp, IGame, IMan } from './interfaces';
import { PowerUpType } from './enums';
export class Man implements IMan {

    public lives = 3;
    public dead = false;
    get target(): Sprite {
        return this._target;
    }

    // Умения
    skills = {
        // Количество бомб который может поставить
        bombs: 1,
        // Радиус взрыва
        flames: 1,
        // Скорость
        speed: 60,
        // Умение проходить сквозь стену
        wallPass: false,
        // Умение самому взорвать бомбы по кнопке "X".
        detonator: false,
        // Умение проходить сквозь бомбу
        bombPass: false,
        // Способность не получать уран от бомбы
        flamePass: false,
        // Бессмертие
        mystery: false
    };

    private name;
    private _game: IGame;
    private _mysteryTimeout = 20_000;
    private _target: Sprite;
    private _keyboard;

    constructor(game: IGame) {
        this._game = game;
        this._target = this._game.engine.add.sprite(16, 16, 'man');
        this._game.engine.physics.arcade.enable(this._target);

        this._target.name = 'man';
        this.name = 'man';

        this._target.body.collideWorldBounds = true;
        this._target.body.setCircle(8);
        this._initSprites();

        // Подписка на события мыши.
        this._keyboard = {
            leftKey: this._game.engine.input.keyboard.addKey(Keyboard.LEFT),
            rightKey: this._game.engine.input.keyboard.addKey(Keyboard.RIGHT),
            upKey: this._game.engine.input.keyboard.addKey(Keyboard.UP),
            downKey: this._game.engine.input.keyboard.addKey(Keyboard.DOWN)
        };
    }

    destroy(): void {
        this._target.destroy();
        this._target = void 0;
    }

    // Умирает
    die(): void {
        if (this.dead || this.skills.mystery) {
            return;
        }
        this.lives--;
        this._target.body.velocity.setTo(0, 0);
        this._target.animations.play('manDie', 10, false);
        this.dead = true;

        // Навыки которые теряются при смерти
        this.skills.wallPass = false;
        this.skills.detonator = false;
        this.skills.bombPass = false;
        this.skills.flamePass = false;
        this.skills.mystery = false;
    }

    // Оживает
    comeToLife() {
        this.dead = false;
        this._target.body.velocity.setTo(0, 0);
        this._target.x = 16;
        this._target.y = 16;
        this._target.animations.play('manStop', 10, false);
    }

    update() {
        if (this.dead) {
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

    applyBonus(bonus: IPowerUp): void {
        switch (bonus.type) {
        case PowerUpType.Bombs:
            this.skills.bombs++;
            break;
        case PowerUpType.Flames:
            this.skills.flames++;
            break;
        case PowerUpType.Speed:
            this.skills.speed += 10;
            break;
        case PowerUpType.WallPass:
            this.skills.wallPass = true;
            break;
        case PowerUpType.Detonator:
            this.skills.detonator = true;
            break;
        case PowerUpType.BombPass:
            this.skills.bombPass = true;
            break;
        case PowerUpType.FlamePass:
            this.skills.flamePass = true;
            break;
        case PowerUpType.Mystery:
            this.skills.mystery = true;
            setTimeout(() => {
                this.skills.mystery = false;
            }, this._mysteryTimeout);
            break;
        }
    }

    // Движение в каждую сторону и запуск соответствующей анимации.
    private _goLeft() {
        this._target.body.velocity.setTo(-this.skills.speed, 0);
        this._target.animations.play('manWalkLeft', 10, true);
    }

    private _goRight() {
        this._target.body.velocity.setTo(this.skills.speed, 0);
        this._target.animations.play('manWalkRight', 10, true);
    }

    private _goDown() {
        this._target.body.velocity.setTo(0, this.skills.speed);
        this._target.animations.play('manWalkDown', 10, true);
    }

    private _goUp() {
        this._target.body.velocity.setTo(0, -this.skills.speed);
        this._target.animations.play('manWalkUp', 10, true);
    }

    private _stop() {
        this._target.body.velocity.setTo(0, 0);
        this._target.animations.play('manStop', 10, false);
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

}
