import { PowerUpType } from './enums';
import { IPowerUp, IGame, IPosition } from './interfaces';

export class PowerUp implements IPowerUp {

    get target() {
        return this._target;
    }

    public score = 0;
    public destroyed = false;
    public type: PowerUpType;
    private _target: Phaser.Sprite;
    private _block: Phaser.Sprite;

    constructor (game: IGame) {
        this.type = game.stage.powerUp;
        this._target = game.engine.add.sprite(0, 0, 'bonuses');
        this._target.name = 'bonus';
        game.engine.physics.arcade.enable(this._target);
        game.engine.world.sendToBack(this._target);
        this._target.body.immovable = true;
        this.score = 1000;

        this._target.animations.add(`animation-${PowerUpType.Bombs}`, [0]);
        this._target.animations.add(`animation-${PowerUpType.Flames}`, [1]);
        this._target.animations.add(`animation-${PowerUpType.Speed}`, [2]);
        this._target.animations.add(`animation-${PowerUpType.WallPass}`, [3]);
        this._target.animations.add(`animation-${PowerUpType.Detonator}`, [4]);
        this._target.animations.add(`animation-${PowerUpType.BombPass}`, [5]);
        this._target.animations.add(`animation-${PowerUpType.FlamePass}`, [6]);
        this._target.animations.add(`animation-${PowerUpType.Mystery}`, [7]);

        this._target.animations.play(`animation-${this.type}`);
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
