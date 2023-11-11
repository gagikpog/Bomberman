import { IBonus, IGame } from './interfaces';

export class Bonus implements IBonus {

    public score = 0;
    public destroyed = false;
    private _target: Phaser.Sprite;

    constructor (game: IGame) {
        this._target = game.engine.add.sprite(0, 0, 'bonuses');
        this._target.name = 'bonus';
        game.engine.physics.enable(this._target, Phaser.Physics.ARCADE);
        this._target.body.collideWorldBounds = true;
        this._target.body.setCircle(1);
        game.engine.world.sendToBack(this._target);
        this.score = 1000;
    }

    destroy(): void {
        this._target.destroy();
        this._target = null;
        this.destroyed = true;
    }

    setPosition(x: number, y: number) {
        if (!this.destroyed) {
            this._target.x = x;
            this._target.y =y;
        }
    }
}
