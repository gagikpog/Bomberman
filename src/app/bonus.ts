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
        return bonuses[(level - 1) % bonuses.length] || BonusType.Flames;
    }
}

const bonuses = [
    // 1-5
    BonusType.Flames,
    BonusType.Bombs,
    BonusType.Detonator,
    BonusType.Speed,
    BonusType.Bombs,
    // 6-10
    BonusType.Bombs,
    BonusType.Flames,
    BonusType.Detonator,
    BonusType.BombPass,
    BonusType.WallPass,
    // 11-15
    BonusType.Bombs,
    BonusType.Bombs,
    BonusType.Detonator,
    BonusType.BombPass,
    BonusType.Flames,
    // 16-20
    BonusType.WallPass,
    BonusType.Bombs,
    BonusType.BombPass,
    BonusType.Bombs,
    BonusType.Detonator,
    // 21-25
    BonusType.BombPass,
    BonusType.Detonator,
    BonusType.Bombs,
    BonusType.Detonator,
    BonusType.BombPass,
    // 26-30
    BonusType.Mystery,
    BonusType.Flames,
    BonusType.Bombs,
    BonusType.Detonator,
    BonusType.FlamePass,
    // 31-35
    BonusType.WallPass,
    BonusType.Bombs,
    BonusType.Detonator,
    BonusType.Mystery,
    BonusType.BombPass,
    // 36-40
    BonusType.FlamePass,
    BonusType.Detonator,
    BonusType.Flames,
    BonusType.WallPass,
    BonusType.Mystery,
    // 41-45
    BonusType.Detonator,
    BonusType.WallPass,
    BonusType.BombPass,
    BonusType.Detonator,
    BonusType.Mystery,
    // 46-50
    BonusType.WallPass,
    BonusType.BombPass,
    BonusType.Detonator,
    BonusType.FlamePass,
    BonusType.Mystery
];
