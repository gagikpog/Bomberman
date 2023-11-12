import { IGame, IPosition, IWall } from './interfaces';

export function buildBlock(game: IGame, pos: IPosition): IWall {
    const block: Phaser.Sprite = game.groups.wallsBrocken.create(pos.x, pos.y, 'block2');
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

    game.engine.physics.arcade.enable(destroyAnimation);

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
