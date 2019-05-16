//Создание и инициализация окна. Далле все обрашение к игре происходит через переменную game.
var game = new Phaser.Game(480, 320, Phaser.CANVAS, null,{
        preload: preload,
        create: create,
        update: update
});

function create() {

}

function update() {

}

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
}