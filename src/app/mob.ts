import { Sprite, Signal } from 'phaser-ce';
import { IGame, IMob, IPosition } from './interfaces';
import { Spooks } from './enums';
import { getSpookDieAnimation, getSpookLeftAnimation, getSpookRightAnimation, getSpookScore, getSpookSpeed, getSpookWallPass } from './spook';

export class Mob implements IMob {
    dead = false;
    score = 100;
    get target(): Sprite {
        return this._target;
    }
    private _target: Sprite;
    private _speed = 40;
    private _type: Spooks;

    constructor(game: IGame, pos: IPosition, spookType: Spooks) {
        this._type = spookType;
        this.score = getSpookScore(this._type);
        this._speed = getSpookSpeed(this._type);
        const wallPass = getSpookWallPass(this._type);
        this._target = game.engine.add.sprite(pos.x, pos.y, this._type);
        game.groups.mobGroup.add(this._target);
        if (!wallPass) {
            game.groups.mobWallCollideGroup.add(this._target);
        }

        this._target.name = 'mob';

        this._target.body.onCollide = new Signal();
        this._target.body.onCollide.add(this._collide, this._target);

        // Анимация которая будут рисоваться при каждом действии.
        this._target.animations.add('mobWalkLeft', getSpookLeftAnimation(this._type));
        this._target.animations.add('mobWalkRight', getSpookRightAnimation(this._type));
        this._target.animations.add('mobDie', getSpookDieAnimation(this._type));

        this._target.update = this._update;
        this._collide();
    }

    die() {
        if (this.dead) {
            return;
        }
        this.dead = true;
        this._target.animations.play('mobDie', 10, false);
        this.dead = true;
        this._target.body.velocity.setTo(0, 0);
        setTimeout(()=>{
            this.destroy();
        }, 1000);
    }

    destroy(): void {
        this._target.destroy();
    }

    // Движение в каждую сторону и запуск соответствующей анимации.
    private _goLeft() {
        this._target.body.velocity.setTo(-this._speed, 0);
        this._target.animations.play('mobWalkLeft', 8, true);
    }

    private _goRight() {
        this._target.body.velocity.setTo(this._speed, 0);
        this._target.animations.play('mobWalkRight', 8, true);
    }

    private _goDown() {
        this._target.body.velocity.setTo(0, this._speed);
    };

    private _goUp() {
        this._target.body.velocity.setTo(0, -this._speed);
    };

    private _collide = (): void => {
        this._changeDirection();
    };

    private _update = () => {
        if (Math.random() < 0.1) {
            this._changeDirection();
        }

        if (this._target.body.velocity.x === 0) {
            this._target.x = this._round(this._target.x);
        }

        if (this._target.body.velocity.y === 0) {
            this._target.y = this._round(this._target.y);
        }
    };

    private _changeDirection() {
        if (this._canChangeDirection() && !this.dead) {
            const val = Math.random();
            if (val < 0.25) {
                this._goUp();
            } else if (val < 0.5) {
                this._goRight();
            } else if (val < 0.75) {
                this._goLeft();
            } else {
                this._goDown();
            }
        }
    }

    private _canChangeDirection(): boolean {
        const size = 16;
        const eps = 2;
        const deltaX = this.target.x % size;
        const deltaY = this.target.y % size;
        return (deltaX < eps || deltaX > size - eps) && (deltaY < eps || deltaY > size - eps);
    }

    private _round(num: number): number {
        const n = Math.round(num);
        const diff = n % 16;
        if (diff >= 8) {
            return n - diff + 16;
        } else {
            return n - diff;
        }
    }
}
