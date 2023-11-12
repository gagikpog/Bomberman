import { BonusType } from './enums';
import { IBonus, IGame, IPosition } from './interfaces';

export class Bonus implements IBonus {

    get target() {
        return this._target;
    }

    public score = 0;
    public destroyed = false;
    public type: BonusType;
    private _target: Phaser.Sprite;
    private _block: Phaser.Sprite;

    constructor (game: IGame) {
        this.type = this._getTypeByLevel(game.stage);
        this._target = game.engine.add.sprite(0, 0, 'bonuses');
        this._target.name = 'bonus';
        game.engine.physics.arcade.enable(this._target);
        game.engine.world.sendToBack(this._target);
        this._target.body.immovable = true;
        this.score = 1000;

        this._target.animations.add(`animation-${BonusType.Bombs}`, [0]);
        this._target.animations.add(`animation-${BonusType.Flames}`, [1]);
        this._target.animations.add(`animation-${BonusType.Speed}`, [2]);
        this._target.animations.add(`animation-${BonusType.WallPass}`, [3]);
        this._target.animations.add(`animation-${BonusType.Detonator}`, [4]);
        this._target.animations.add(`animation-${BonusType.BombPass}`, [5]);
        this._target.animations.add(`animation-${BonusType.FlamePass}`, [6]);
        this._target.animations.add(`animation-${BonusType.Mystery}`, [7]);

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

    private _getTypeByLevel(level: number): BonusType {
        const bonuses = [
            BonusType.Mystery,
            BonusType.Flames,
            BonusType.Bombs,
            BonusType.Speed,
            BonusType.WallPass,
            BonusType.Detonator,
            BonusType.BombPass,
            BonusType.FlamePass
        ];

        return bonuses[level % bonuses.length] || BonusType.Flames;
    }
}
