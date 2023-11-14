import Phaser from 'phaser-ce';
import { bindKeyboard } from './functions';
import { IBonus, IDoor, IGame, IMan, IMob } from './interfaces';
import { Man } from './man';
import { buildMainWalls, buildLevel } from './generateMap';
import { Door } from './door';
import { destroyWall, manDie, manGetBonus, manWalksThroughTheDoor, mobDie } from './collides';

export class Game implements IGame {

    public mobsCount = 6;
    public bonus: IBonus = null;
    public door: IDoor = null;
    public player: IMan = null;
    public engine: Phaser.Game = null;
    public bombs: Phaser.Sprite[] = [];
    public mobs: IMob[] = [];
    public blocks: Phaser.Sprite[] = [];
    public isGame = true;
    public score = 0;
    public gameWidth = 31;
    public gameHeight = 13;
    public blockSize = 16;
    public stage = 1;
    public groups = {
        walls: null,
        mobGroup: null,
        bombsGroup: null,
        bumGroup: null,
        wallsBrocken: null
    };

    private time = 180;
    private _prevTime = 0;
    private _rect = null;
    private _refs: {
        time: HTMLSpanElement;
        score: HTMLSpanElement;
        lives: HTMLSpanElement;
        header: HTMLDivElement;
    };

    constructor() {

        this.engine = new Phaser.Game(this.gameWidth * this.blockSize, this.gameHeight * this.blockSize, Phaser.AUTO, null, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });

        this._refs = {
            time: document.querySelector('#time'),
            score: document.querySelector('#score'),
            lives: document.querySelector('#lives'),
            header: document.querySelector('#header')
        };

        this._rect = new Phaser.Rectangle(0, 0, 500, 500);
    }

    preload = () => {
        this.engine.stage.backgroundColor = '#1F8B00';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
            // Do Firefox-related activities
            this.engine.load.baseURL = './assets/';
            this.engine.load.crossOrigin = 'anonymous';
        }
        this.engine.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.engine.scale.pageAlignHorizontally = true;
        this.engine.scale.pageAlignVertically = true;
        this.engine.load.spritesheet('man', 'man.png', 16, 16, 21);
        this.engine.load.spritesheet('mob1', 'mob1.png', 16, 16, 11);
        this.engine.load.spritesheet('bomb', 'bomb.png', 16, 16, 3);
        this.engine.load.spritesheet('bum', 'bum.png', 16, 16, 36);
        this.engine.load.spritesheet('bum1', 'b1.png', 36, 12, 1);
        this.engine.load.spritesheet('mainWall', 'mainWall.png', 16, 16, 1);
        this.engine.load.spritesheet('wall', 'wall.png', 16, 16, 1);
        this.engine.load.spritesheet('wallDestroy', 'wallDestroy.png', 16, 16, 7);
        this.engine.load.spritesheet('bonuses', 'bonuses.png', 16, 16, 14);
        this.engine.load.spritesheet('door', 'door.png', 16, 16, 14);
    };

    render = () => {
        if (this.isGame) {
            this._updateStatusBar();
            this.engine.debug.text('', 60, 20);
        } else {
            this._hideStatusBar();
            this.engine.debug.geom(this._rect, 'rgba(0, 0, 0, 1)');
            this.engine.debug.text(
                `STAGE ${this.stage}`,
                this.gameWidth * this.blockSize / 2 - 30,
                this.gameHeight * this.blockSize / 2 - 20
            );
        }
    };

    create = () => {
        setInterval(() => {
            if (this.time-- === 0) {
                this.player.die();
                this.time = 180;
            }
        }, 1000);

        this.engine.physics.startSystem(Phaser.Physics.ARCADE);
        this.groups.walls = this.engine.add.group();
        this.groups.walls.enableBody = true;

        this.groups.wallsBrocken = this.engine.add.group();
        this.groups.wallsBrocken.enableBody = true;

        this.groups.bombsGroup = this.engine.add.group();
        this.groups.bombsGroup.enableBody = true;

        this.groups.bumGroup = this.engine.add.group();
        this.groups.bumGroup.enableBody = true;

        this.groups.mobGroup = this.engine.add.group();
        this.groups.mobGroup.enableBody = true;

        this.door = new Door(this);

        buildMainWalls(this);
        this.newGame();
    };

    update = () => {
        this.engine.physics.arcade.collide(this.player.target, this.groups.walls);
        if (!this.player.skills.wallPass) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.wallsBrocken);
        }
        if (!this.player.skills.bombPass) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.bombsGroup);
        }
        if (!this.player.skills.flamePass) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.bumGroup, () => manDie(this));
        }
        this.engine.physics.arcade.collide(this.player.target, this.bonus.target, () => manGetBonus(this));
        this.engine.physics.arcade.collide(this.player.target, this.door.target, () => manWalksThroughTheDoor(this));
        this.engine.physics.arcade.collide(this.player.target, this.groups.mobGroup, (man, mob) => manDie(this, mob));

        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.walls);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.wallsBrocken);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bombsGroup);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bumGroup, (mob: Phaser.Sprite) => mobDie(this, mob));

        this.engine.physics.arcade.collide(this.groups.bumGroup, this.groups.wallsBrocken, (bomb, wall) => destroyWall(this, wall));
        this.player.update();
    };

    nextLevel() {
        if (this.player.lives === 0) {
            alert('Game over');
            this.newGame();
            return;
        }

        this.bonus?.destroy();
        const destroy = (item) => item.destroy();
        this.blocks.forEach(destroy);
        this.mobs.forEach(destroy);
        this.bombs.forEach(destroy);

        this.time = 180;
        this.blocks = [];
        this.mobs = [];
        this.bombs = [];
        buildLevel(this);
        this.player.comeToLife();
    }

    newGame() {
        if (this.player) {
            this.player.destroy();
        }

        // Создается игрок, происходить инициализация и привязка всех методов.
        this.player = new Man(this);
        this.engine.world.bringToTop(this.groups.walls);

        this.score = 0;
        this.stage = 1;
        this.nextLevel();
        bindKeyboard(this);
    }

    winLevel() {
        this.stage++;
        this.player.lives++;
        this.isGame = false;
        setTimeout(() => {
            this.isGame = true;
        }, 3000);
        this.nextLevel();
    }

    private _updateStatusBar(): void {
        if (this._prevTime !== this.time) {
            this._prevTime = this.time;
            this._refs.time.innerText = `${this.time}`;
            this._refs.score.innerText = `${this.score}`;
            this._refs.lives.innerText = `${this.player.lives}`;
        }

        if (this._refs.header.classList.contains('header-hidden')) {
            this._refs.header.classList.toggle('header-hidden');
        }

    }

    private _hideStatusBar(): void {
        if (!this._refs.header.classList.contains('header-hidden')) {
            this._refs.header.classList.toggle('header-hidden');
        }
    }

}
