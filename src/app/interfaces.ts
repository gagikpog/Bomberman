export interface IGame {
    engine: Phaser.Game;
    mobsCount: number;
    mobs: IMob[];
    blocks: IWall[];
    bombs: Phaser.Sprite[];
    bonus: IBonus;
    door: IDoor;
    player: IMan;
    isGame: boolean;
    score: number;
    gameWidth: number;
    gameHeight: number;
    blockSize: number;
    groups: {
        walls: Phaser.Group;
        mobGroup: Phaser.Group;
        bombsGroup: Phaser.Group;
        bumGroup: Phaser.Group;
        wallsBrocken: Phaser.Group;
    };
    newGame(): void;
    nextLevel(): void;
    winLevel(): void;
}

export interface IMob {
    die: boolean;
    destroy(): void;
}

export interface IMan {
    lives: number;
    readonly target: Phaser.Sprite;
    comeToLife(): void;
    die(): void;
    update(): void;
    dropBomb(): void;
    blowUp(): void;
    destroy(): void;
}

export interface IBonus {
    score: number;
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
