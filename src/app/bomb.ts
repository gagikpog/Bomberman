import { Sprite } from 'phaser-ce';
import { getBombSize, runBombAnimation } from './bombAnimation';
import { IGame } from './interfaces';

export function detonateBombInChain(game: IGame, bomb: Sprite): void {
    if (bomb.body) {
        game.bombs = game.bombs.filter((b: Sprite) => b !== bomb);
        setTimeout(() => {
            detonateBomb(game, bomb);
        }, 100);
    }
}

export function detonateAnOldBomb(game: IGame): void {
    if (!game.player.dead && game.bombs.length) {
        const bomb = game.bombs.shift();
        detonateBomb(game, bomb);
    }
}

export function detonateBomb(game: IGame, bomb: Sprite): void {
    const bombSize = getBombSize(game, bomb);
    runBombAnimation(game, bomb, bombSize);

    const blockSize = game.blockSize;
    const offset = 4;
    const bum1 = game.engine.add.tileSprite(bomb.x - bombSize.left*blockSize + offset , bomb.y + offset, blockSize*(bombSize.left + bombSize.right + 1) - offset*2, blockSize - offset*2, 'bum1');
    const bum2 = game.engine.add.tileSprite(bomb.x + offset, bomb.y - bombSize.top*blockSize + offset, blockSize - offset*2, blockSize*(bombSize.top + bombSize.bottom + 1) - offset*2, 'bum1');

    game.groups.bumGroup.add(bum1);
    game.groups.bumGroup.add(bum2);
    bum1.name = 'bum0';
    bum2.name = 'bum0';
    bum1.body.immovable = true;
    bum2.body.immovable = true;
    game.engine.world.bringToTop(game.player.target);
    bomb.destroy();
    setTimeout(() => {
        bum1.destroy();
        bum2.destroy();
    }, 500);
}

export function plantBomb(game: IGame): void {
    if (game.bombs.length < game.player.skills.bombs && !game.player.dead) {
        const x = game.player.target.x + 8;
        const y = game.player.target.y + 8;

        const posX = x - x % 16;
        const posY = y - y % 16;
        let i = 0;
        for (i = 0;i < game.bombs.length; i++) {
            if (game.bombs[i].x === posX && game.bombs[i].y === posY) {
                return;
            }
        }
        const bomb = game.groups.bombsGroup.create(posX, posY, 'bomb');

        bomb.name = 'bomb';
        bomb.animations.add('bombLife', [1, 0, 2, 0]);
        bomb.animations.play('bombLife', 5, true);
        bomb.body.immovable = true;

        game.bombs.push(bomb);
        game.engine.world.bringToTop(game.player.target);
        if (!game.player.skills.detonator) {
            setTimeout(() => {
                detonateAnOldBomb(game);
            }, 2000);
        }
    }
}
