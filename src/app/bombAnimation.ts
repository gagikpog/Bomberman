import { Sprite } from 'phaser-ce';
import { IGame, IPosition } from './interfaces';

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

export function runBombAnimation(game: IGame, bomb: Sprite): void {
    const size = game.player.skills.flames;
    const sprites: Sprite[] = [
        ...getLeft(game, bomb, size),
        ...getTop(game, bomb, size),
        ...getRight(game, bomb, size),
        ...getBottom(game, bomb, size),
        getAnimation(game, 'center', {x: bomb.x, y: bomb.y})
    ];

    for (let i = sprites.length - 1; i >= 0; i--) {
        game.engine.world.sendToBack(sprites[i]);
    }

    setTimeout(() => {
        sprites.forEach((sprite) => sprite.destroy());
    }, 700);
}
