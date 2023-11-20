import { Sprite } from 'phaser-ce';
import { IGame, IMob, IWall } from './interfaces';
import { buildMob } from './generateMap';
import { Spooks } from './enums';

export function manGetBonus(game: IGame): void {
    if (game.powerUp.canDestroy()) {
        game.player.applyBonus(game.powerUp);
        game.score += game.powerUp.score;
        game.powerUp.destroy();
    }
}

export function manWalksThroughTheDoor(game: IGame): void {
    if (game.powerUp.destroyed && game.door.opened()) {
        const allMobsAreDead = game.mobs.every((mob) => mob.dead);
        if (allMobsAreDead) {
            game.winLevel();
        }
    }
}

export function manDie(game: IGame, mobSprite?: Phaser.Sprite) {
    if (mobSprite) {
        const mob = game.mobs.find((item: IMob) => item.target === mobSprite);
        if (mob && !mob.dead && !game.player.dead) {
            game.losingLevel();
        }
    } else {
        if (!game.player.dead) {
            game.losingLevel();
        }
    }
}

export function mobDie(game: IGame, mobSprite: Phaser.Sprite): void {
    const mob = game.mobs.find((item: IMob) => item.target === mobSprite);
    if (mob && !mob.dead) {
        mob.die();
        game.score += mob.score;
    }
}

export function destroyWall(game: IGame, wall: IWall): void {
    if (wall.body && wall.visible) {
        const destroyAnimation = game.engine.add.sprite(wall.x, wall.y, 'wallDestroy');
        game.engine.physics.arcade.enable(destroyAnimation);

        destroyAnimation.body.immovable = true;
        destroyAnimation.animations.add('brokeAnimation', [1, 2, 3, 4, 5, 6]);
        destroyAnimation.animations.play('brokeAnimation', 10, false);

        wall.visible = false;
        wall.x = 0;
        setTimeout(() => {
            destroyAnimation.destroy();
            wall.destroy();
        }, 500);
    }
}

export function freeTheSpooks(game: IGame, target: Sprite, type: string): void {
    if (game.canFreeSpooks(type)) {
        setTimeout(() => {
            for (let i = 0; i < game.maxSpookCount; i++) {
                buildMob(game, {x: target.x, y: target.y}, Spooks.Pontan);
            }
            if (type === 'bonus') {
                game.powerUp.destroy();
            }
        }, 500);
    }
}

export function checkCustomCollide(sprite1: Sprite, sprite2: Sprite, eps = 8): boolean {
    return sprite1 && sprite2 &&
        Math.sqrt(Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)) < eps;
}
