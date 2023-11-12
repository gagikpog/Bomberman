import Phaser from 'phaser-ce';
import { IGame, IMob, IPosition } from './interfaces';

export class Mob implements IMob {
    die = false;
    private _target: Phaser.Sprite;
    private _speed = 40;
    private _score = 100;
    private _game: IGame;

    constructor(game: IGame, pos: IPosition) {
        this._game = game;
        this._target = game.groups.mobGroup.create(pos.x, pos.y, 'mob1');

        this._target.name = 'mob';

        this._target.body.onCollide = new Phaser.Signal();
        this._target.body.onCollide.add(this._mobCollide, this._target);

        // Анимация которая будут рисоваться при каждом действии.
        this._target.animations.add('mobWalkLeft', [3, 4, 5]);
        this._target.animations.add('mobWalkRight', [0, 1, 2]);
        this._target.animations.add('mobDie', [7, 8, 9, 10]);

        // Загрузка изначальной кортики.
        this._target.animations.play('mobWalkLeft', 8, true);
        this._target.update = this._update;
        this._collide();
    }

    public destroy(): void {
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

    private _mobCollide = (_mob, spr) => {
        this._collide();
        switch(spr.name) {
        case 'bum0':
            this._die();
            break;
        }
    };

    private _collide(): void {
        if(this.die){
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
    }

    private _die() {
        if (this.die) {
            return;
        }
        this.die = true;
        this._target.animations.play('mobDie', 10, false);
        this.die = true;
        this._target.body.velocity.setTo(0, 0);
        // FIXME: Переместить в правильное место
        this._game.score += this._score;
        setTimeout(()=>{
            this.destroy();
        }, 1000);
    }

    private _update = () => {
        if(this.die){
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
