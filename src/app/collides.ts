import { IGame, IMob, IWall } from './interfaces';

export function manGetBonus(game: IGame): void {
    if (game.bonus.canDestroy()) {
        game.player.applyBonus(game.bonus);
        game.score += game.bonus.score;
        game.bonus.destroy();
    }
}

export function manWalksThroughTheDoor(game: IGame): void {
    if (game.bonus.destroyed && game.door.opened()) {
        const allMobsAreDead = game.mobs.every((mob) => mob.dead);
        if (allMobsAreDead) {
            game.winLevel();
        }
    }
}

export function manDie(game: IGame) {
    game.player.die();
}

export function mobDie(game: IGame, mobSprite: Phaser.Sprite): void {
    const mob = game.mobs.find((item: IMob) => item.target === mobSprite);
    if (mob && !mob.dead) {
        mob.die();
        game.score += mob.score;
    }
}

export function destroyWall(game: IGame, wall: IWall): void {
    if (wall.body) {
        const destroyAnimation = game.engine.add.sprite(wall.x, wall.y, 'wallDestroy');
        wall.destroy();

        game.engine.physics.arcade.enable(destroyAnimation);

        destroyAnimation.body.immovable = true;
        destroyAnimation.animations.add('brokeAnimation', [1, 2, 3, 4, 5, 6]);
        destroyAnimation.animations.play('brokeAnimation', 10, false);

        setTimeout(() => {
            destroyAnimation.destroy();
        }, 500);
    }
}
