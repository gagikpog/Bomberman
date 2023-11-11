export interface IGame {
    engine: Phaser.Game;
    mobsCount: number;
    mobs: IMob[];
    blocks: IWall[];
    bombs: Phaser.Sprite[];
    bonus: IBonus;
    player: IMan;
    isGame: boolean;
    score: number;
    groups: {
        walls: Phaser.Group;
        door: Phaser.Group;
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
    destroy(): void;
    setPosition(x: number, y: number): void;
}

export type IWall = Phaser.Sprite;

export interface IPosition {
    x: number;
    y: number;
}
