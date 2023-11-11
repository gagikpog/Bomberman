
import { IGame, IWall } from './interfaces';
import { Mob } from './mob';

export function buildWalls(game: IGame) {
    let _mobsCount = game.mobsCount;

    let i, j, b = 0,
        firstBonus = true,
        firstDoor = true,
        n = 0;
    const doorPosition = Math.floor(Math.random() * 1000) % 200;
    const bonusPosition = Math.floor(Math.random() * 1000) % 200;
    for (j = 0; j < 11; j++) {
        for (i = 0; i < 29; i++) {
            if (i % 2 && j % 2 || i < 2 && j < 2) {
                continue;
            }
            b = Math.random();
            if (b < 0.3) {
                if (n > doorPosition && firstDoor) {
                    game.groups.door.x = i * 16 + 16;
                    game.groups.door.y = j * 16 + 48;
                    firstDoor = false;
                } else {
                    if (n > bonusPosition && firstBonus) {
                        game.bonus.setPosition(i * 16 + 16, j * 16 + 48);
                        firstBonus = false;
                    }
                }
                game.blocks.push(buildBlock(game.groups.wallsBrocken.create(i * 16 + 16, j * 16 + 48, 'block2'), game));
            } else {
                if (b > 0.92 && _mobsCount-- > 0) {
                    game.mobs.push(new Mob(game, { x: i, y: j }));
                }
            }
            n++;
        }
    }
}

export function buildMainWalls(game: IGame): void {
    const width = 31;
    const height = 13;
    const blockSize = 16;
    const offsetTop = 32;

    const isMainWall = (i, j) => {
        return i === 0 || j === 0 || i === width - 1 || j === height - 1;
    };
    const isGridWall = (i, j) => {
        return i % 2 === 0 && j % 2 === 0;
    };

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (isMainWall(i, j) || isGridWall(i, j)) {
                game.groups.walls.create(blockSize * i, offsetTop + j * blockSize, 'block1').body.immovable = true;
            }
        }
    }
}

function buildBlock(block: Phaser.Sprite, game: IGame): IWall {
    block.name = 'block2';
    block.body.immovable = true;
    block.body.onCollide = new Phaser.Signal();
    block.body.onCollide.add((_b, spr) => {
        if (spr.name === 'bum0') {
            destroyWall(game, block);
        }
    }, this);

    return block;
}

function destroyWall(game: IGame, wall: IWall): void {
    const destroyAnimation = game.engine.add.sprite(wall.x, wall.y, 'block3');

    game.engine.physics.enable(destroyAnimation, Phaser.Physics.ARCADE);

    destroyAnimation.body.collideWorldBounds = true;
    destroyAnimation.body.immovable = true;
    destroyAnimation.animations.add('brokeAnimation', [1, 2, 3, 4, 5, 6]);
    destroyAnimation.animations.play('brokeAnimation', 10, false);
    wall.destroy();

    setTimeout(() => {
        destroyAnimation.destroy();
    }, 500);
}

export function bindKeyboard(game: IGame): void {
    game.engine.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(() => {
        game.player.dropBomb();
    });
    game.engine.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(() => {
        game.player.dropBomb();
    });
    game.engine.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
        game.player.blowUp();
    });
}
