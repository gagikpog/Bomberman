import { IBonus, IGame, IPosition } from './interfaces';

export class Bonus implements IBonus {

    get target() {
        return this._target;
    }

    public score = 0;
    public destroyed = false;
    private _target: Phaser.Sprite;
    private _block: Phaser.Sprite;

    constructor (game: IGame) {
        this._target = game.engine.add.sprite(0, 0, 'bonuses');
        this._target.name = 'bonus';
        game.engine.physics.arcade.enable(this._target);
        game.engine.world.sendToBack(this._target);
        this._target.body.immovable = true;
        this.score = 1000;
    }

    destroy(): void {
        if (!this.destroyed) {
            this._target.destroy();
            this._target = null;
            this._block = null;
            this.destroyed = true;
        }
    }

    setPosition(pos: IPosition) {
        if (!this.destroyed) {
            this._target.x = pos.x;
            this._target.y = pos.y;
        }
    }

    canDestroy(): boolean {
        return !this.destroyed && !(this._block?.body);
    }

    setBlock(block: Phaser.Sprite): void {
        this._block = block;
    }
}
