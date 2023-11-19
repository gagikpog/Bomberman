import { PowerUp } from './powerUp';
import { Spooks } from './enums';
import { buildBlock } from './functions';
import { getRandomFreePosition, mainWallIndexGenerator } from './generator';
import { IGame, IPosition } from './interfaces';
import { Mob } from './mob';

export function buildLevel(game: IGame) {
    const random = getRandomFreePosition(game.gameWidth, game.gameHeight);
    if (!game.stage.isBonusStage) {
        buildBonus(game, random);
        buildDoor(game, random);
        buildWalls(game, random, 53);
    }
    buildMobs(game, random);
}

export function buildMainWalls(game: IGame): void {
    const width = game.gameWidth;
    const height = game.gameHeight;
    const blockSize = game.blockSize;
    const it = mainWallIndexGenerator(width, height);

    let result = it.next();
    while (!result.done) {
        game.groups.walls.create(blockSize * result.value.x, result.value.y * blockSize, 'mainWall').body.immovable = true;
        result = it.next();
    }
}

function buildBonus(game: IGame, random: Generator<IPosition>) {
    const pos = multiplePosition(random.next().value, game.blockSize);
    const block = buildBlock(game, pos);
    game.blocks.push(block);
    game.powerUp = new PowerUp(game);
    game.powerUp.setPosition(pos);
    game.powerUp.setBlock(block);
}

function buildDoor(game: IGame, random: Generator<IPosition>) {
    const pos = multiplePosition(random.next().value, game.blockSize);
    const block = buildBlock(game, pos);
    game.blocks.push(block);
    game.door.setPosition(pos);
    game.door.setBlock(block);
}

function buildMobs(game: IGame, random: Generator<IPosition>) {
    let maxSpookCount = game.maxSpookCount;
    Object.keys(game.stage.spooks).forEach((type: Spooks) => {
        const count = game.stage.spooks[type] || 0;
        for (let i = 0; i < count && maxSpookCount >= 0; i++, maxSpookCount--) {
            const pos = multiplePosition(random.next().value, game.blockSize);
            buildMob(game, pos, type);
        }
    });
}

export function buildMob(game: IGame, pos: IPosition, spookType: Spooks) {
    game.mobs.push(new Mob(game, pos, spookType));
}

function buildWalls(game: IGame, random: Generator<IPosition>, count: number) {
    for (let i = 0; i < count; i++) {
        const pos = multiplePosition(random.next().value, game.blockSize);
        game.blocks.push(buildBlock(game, pos));
    }
}

function multiplePosition(pos: IPosition, size: number): IPosition {
    return { x: pos.x * size, y: pos.y * size };
}
