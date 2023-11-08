import Phaser from 'phaser-ce';
import { Man } from './man';

export function initWalls(walls) {
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
                walls.create(blockSize*i, offsetTop + j*blockSize, 'block1').body.immovable = true;
            }
        }
    }
}

export function newGame(game) {
    if (game.player) {
        game.player.destroy();
    }

    // Создается игрок, происходить инициализация и привязка всех методов.
    game.player = buildMan(game);
    game.engine.world.bringToTop(game.groups.walls);

    game.score = 0;
    game.stage = 1;
    nextLevel();
}

/**
* @function buildMan Конструктор игрока
*/
function buildMan(game) {
    const _man = new Man();

    game.engine.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(() => {
        if (game.bombs.length < _man.skills.bombsStock && !_man.skills.die) {
            _man.dropBomb({
                x: _man.target.x,
                y: _man.target.y
            });
        }
    });

    game.engine.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
        if (_man.skills.isSapper && !_man.skills.die) {
            _man.blowUp();
        }
    });

    return _man;
}
