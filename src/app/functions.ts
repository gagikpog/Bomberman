import { IGame, IPosition, IWall } from './interfaces';

export function buildBlock(game: IGame, pos: IPosition): IWall {
    const block: Phaser.Sprite = game.groups.wallsBrocken.create(pos.x, pos.y, 'wall');
    block.name = 'wall';
    block.body.immovable = true;
    return block;
}

function isOuterWall(x: number, y: number, gameWidth: number, gameHeight: number): boolean {
    return x === 0 || y === 0 || x === gameWidth - 1 || y === gameHeight - 1;
};

function isGridWall(x: number, y: number): boolean {
    return x % 2 === 0 && y % 2 === 0;
};

export function isMainWall(x: number, y: number, gameWidth: number, gameHeight: number) {
    return isOuterWall(x, y, gameWidth, gameHeight) || isGridWall(x, y);
}

export const getKey = (x: number, y: number): string => `${x}-${y}`;
