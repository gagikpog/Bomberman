import { Sprite } from 'phaser-ce';
import { IGame, IPosition } from './interfaces';
import { getKey, isMainWall } from './functions';

interface IBombSize {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

function getAnimation(game: IGame, name: string, pos: IPosition): Sprite {
    const animationTime = 10;
    const res = game.engine.add.sprite(pos.x, pos.y, 'bum');;
    switch (name) {
    case 'leftHead':
        res.animations.add(name, [6, 9, 24, 27, 24, 9, 6]);
        break;
    case 'rightHead':
        res.animations.add(name, [8, 11, 26, 29, 26, 11, 8]);
        break;
    case 'topHead':
        res.animations.add(name, [1, 4, 19, 22, 19, 4, 1]);
        break;
    case 'bottomHead':
        res.animations.add(name, [13, 16, 31, 34, 31, 16, 13]);
        break;
    case 'center':
        res.animations.add(name, [7, 10, 25, 28, 25, 10, 7]);
        break;
    default:
        throw new Error(`Неизвестная анимация "${name}"`);
    }

    res.animations.play(name, animationTime, false);
    return res;
}

function animationMap(game: IGame, count: number, animationGetterCallback: (pos: number) => Sprite): Sprite[] {
    const res = [animationGetterCallback(game.blockSize)];
    const len = count * game.blockSize;
    let position = game.blockSize;

    while (position < len) {
        position += game.blockSize - 4;
        if (position > len) {
            position = len;
        }
        res.push(animationGetterCallback(position));
    }

    return res;
}

function getLeft(game: IGame, bomb: Sprite, count: number): Sprite[] {
    return animationMap(game, count, (pos: number) => {
        return getAnimation(game, 'leftHead', {x: bomb.x - pos, y: bomb.y});
    });
}

function getRight(game: IGame, bomb: Sprite, count: number): Sprite[] {
    return animationMap(game, count, (pos: number) => {
        return getAnimation(game, 'rightHead', {x: bomb.x + pos, y: bomb.y});
    });
}

function getTop(game: IGame, bomb: Sprite, count: number): Sprite[] {
    return animationMap(game, count, (pos: number) => {
        return getAnimation(game, 'topHead', {x: bomb.x, y: bomb.y - pos});
    });
}

function getBottom(game: IGame, bomb: Sprite, count: number): Sprite[] {
    return animationMap(game, count, (pos: number) => {
        return getAnimation(game, 'bottomHead', {x: bomb.x, y: bomb.y + pos});
    });
}

export function runBombAnimation(game: IGame, bomb: Sprite, size: IBombSize): void {
    const sprites: Sprite[] = [
        ...getLeft(game, bomb, size.left),
        ...getTop(game, bomb, size.top),
        ...getRight(game, bomb, size.right),
        ...getBottom(game, bomb, size.bottom),
        getAnimation(game, 'center', {x: bomb.x, y: bomb.y})
    ];

    for (let i = sprites.length - 1; i >= 0; i--) {
        game.engine.world.sendToBack(sprites[i]);
    }

    setTimeout(() => {
        sprites.forEach((sprite) => sprite.destroy());
    }, 700);
}

function calcSize(size: number, isWallCallback: (s: number) => boolean): number {
    let count = 1;

    for (count = 1; count < size; count++) {
        if (isWallCallback(count)) {
            break;
        }
    }
    return count;
}

export function getBombSize(game: IGame, bomb: Sprite): IBombSize {
    const size = game.player.skills.flames;
    const map = game.blocks.reduce((res, block) => {
        if (block.body) {
            const key = getKey(block.x / game.blockSize, block.y / game.blockSize);
            res.set(key, true);
        }
        return res;
    }, new Map());

    const bombX = bomb.x / game.blockSize;
    const bombY = bomb.y / game.blockSize;
    const isWall = (x: number, y: number) => {
        return isMainWall(x, y, game.gameWidth, game.gameHeight) || map.get(getKey(x, y));
    };

    const left = calcSize(size, (count) => isWall(bombX - count, bombY));
    const top = calcSize(size, (count) => isWall(bombX, bombY - count));
    const right = calcSize(size, (count) => isWall(bombX + count, bombY));
    const bottom = calcSize(size, (count) => isWall(bombX, bombY + count));

    return { left, top, right, bottom };
}
