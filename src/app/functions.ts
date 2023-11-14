import { IGame, IPosition, IWall } from './interfaces';

export function buildBlock(game: IGame, pos: IPosition): IWall {
    const block: Phaser.Sprite = game.groups.wallsBrocken.create(pos.x, pos.y, 'wall');
    block.name = 'wall';
    block.body.immovable = true;
    return block;
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
