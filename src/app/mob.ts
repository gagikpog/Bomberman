import Phaser from 'phaser-ce';
import { IGame, IMob, IPosition } from './interfaces';
import { Spooks } from './enums';
import { getSpookDieAnimation, getSpookLeftAnimation, getSpookRightAnimation, getSpookScore, getSpookSpeed, getSpookWallPass } from './spook';

export class Mob implements IMob {
    dead = false;
    score = 100;
    get target(): Phaser.Sprite {
        return this._target;
    }
    private _target: Phaser.Sprite;
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

        this._target.body.onCollide = new Phaser.Signal();
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

    private _goUp = function() {
        this._target.body.velocity.setTo(0, -this._speed);
    };

    private _collide = (): void => {
        if(this.dead){
            return;
        }
        if (Math.random() < 0.4) {
            this._goLeft();
        } else if (Math.random() < 0.4) {
            this._goRight();
        } else if (Math.random() < 0.4) {
            this._goUp();
        } else {
            this._goDown();
        }
    };

    private _update = () => {
        if(this.dead){
            return;
        }

        const probability = 0.001;
        if (Math.random() < probability) {
            this._goLeft();
        } else if (Math.random() < probability) {
            this._goRight();
        } else if (Math.random() < probability) {
            this._goUp();
        } else if (Math.random() < probability) {
            this._goDown();
        }
    };
}
