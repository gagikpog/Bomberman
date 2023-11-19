import { PowerUpType, Spooks } from './enums';

export interface IGame {
    engine: Phaser.Game;
    maxSpookCount: number;
    mobs: IMob[];
    blocks: IWall[];
    bombs: Phaser.Sprite[];
    powerUp: IPowerUp;
    door: IDoor;
    player: IMan;
    score: number;
    gameWidth: number;
    gameHeight: number;
    blockSize: number;
    stage: IStageConfig;
    groups: {
        walls: Phaser.Group;
        mobGroup: Phaser.Group;
        mobWallCollideGroup: Phaser.Group;
        bombsGroup: Phaser.Group;
        bumGroup: Phaser.Group;
        wallsBrocken: Phaser.Group;
    };
    newGame(): void;
    winLevel(): void;
    losingLevel(): void;
    canFreeSpooks(type: string): boolean;
}

export interface IMob {
    target: Phaser.Sprite;
    dead: boolean;
    score: number;
    die(): void;
    destroy(): void;
}

export interface IMan {
    lives: number;
    dead: boolean;
    readonly target: Phaser.Sprite;
    skills: {
        bombs: number;
        flames: number;
        speed: number;
        wallPass: boolean;
        detonator: boolean;
        bombPass: boolean;
        flamePass: boolean;
        mystery: boolean;
    };
    comeToLife(): void;
    die(): void;
    update(): void;
    destroy(): void;
    applyBonus(bonus: IPowerUp): void;
}

export interface IPowerUp {
    score: number;
    type: PowerUpType;
    destroyed: boolean;
    readonly target: Phaser.Sprite;
    destroy(): void;
    canDestroy(): boolean;
    setBlock(block: Phaser.Sprite): void;
    setPosition(pos: IPosition): void;
}

export interface IDoor {
    readonly target: Phaser.Sprite;
    opened(): boolean;
    setBlock(block: Phaser.Sprite): void;
    setPosition(pos: IPosition): void;
}

export type IWall = Phaser.Sprite;

export interface IPosition {
    x: number;
    y: number;
}

export interface IStageConfig {
    id: string;
    name: string;
    isBonusStage: boolean;
    powerUp: PowerUpType;
    spooks: Partial<{
        [Spooks.Balloom]: number;
        [Spooks.Doll]: number;
        [Spooks.Kondoria]: number;
        [Spooks.Minvo]: number;
        [Spooks.Oneal]: number;
        [Spooks.Ovapi]: number;
        [Spooks.Pass]: number;
        [Spooks.Pontan]: number;
    }>;
}
