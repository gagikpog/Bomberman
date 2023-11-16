import { IDoor, IGame, IPosition } from './interfaces';

export class Door implements IDoor {

    get target() {
        return this._target;
    }

    private _target: Phaser.Sprite;
    private _block: Phaser.Sprite;

    constructor (game: IGame) {
        this._target = game.engine.add.sprite(0, 0, 'door');
        this._target.name = 'door';
        game.engine.physics.arcade.enable(this._target);
        this._target.body.immovable = true;
        game.engine.world.sendToBack(this._target);
    }

    setPosition(pos: IPosition) {
        this._target.x = pos.x;
        this._target.y = pos.y;
    }

    opened(): boolean {
        return !(this._block?.body);
    }

    setBlock(block: Phaser.Sprite): void {
        this._block = block;
    }
}
