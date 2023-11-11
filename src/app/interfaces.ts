export interface IGame {
    engine: Phaser.Game;
    mobsCount: number;
    mobs: IMob[];
    blocks: IWall[];
    bombs: Phaser.Sprite[];
    bonus: Phaser.Sprite;
    player: IMan;
    isGame: boolean;
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
}

export interface IMob {
    die: boolean;
    destroy(): void;
}

export interface IMan {
    dropBomb(): void;
    blowUp(): void;
    destroy(): void;
}

export type IWall = Phaser.Sprite;
