import Phaser from 'phaser-ce';
import { IPowerUp, IDoor, IGame, IMan, IMob, IStageConfig } from './interfaces';
import { Man } from './man';
import { buildMainWalls, buildLevel } from './generateMap';
import { Door } from './door';
import {
    checkCustomCollide,
    destroyWall,
    freeTheSpooks,
    manDie,
    manGetBonus,
    manWalksThroughTheDoor,
    mobDie
} from './collides';
import { detonateAnOldBomb, detonateBombInChain, plantBomb } from './bomb';
import { Spooks } from './enums';
import { getStageData } from './levels';

export class Game implements IGame {

    public maxSpookCount = 10;
    public powerUp: IPowerUp = null;
    public door: IDoor = null;
    public player: IMan = null;
    public engine: Phaser.Game = null;
    public bombs: Phaser.Sprite[] = [];
    public mobs: IMob[] = [];
    public blocks: Phaser.Sprite[] = [];
    public score = 0;
    public gameWidth = 31;
    public gameHeight = 13;
    public blockSize = 16;
    public stage: IStageConfig;
    public groups = {
        walls: null,
        mobGroup: null,
        mobWallCollideGroup: null,
        bombsGroup: null,
        bumGroup: null,
        wallsBrocken: null
    };

    private time = 180;
    private _level = 0;
    private _prevTime = 0;
    private _zoom = 3;
    private _canFreeSpooks = true;
    private _timerId;
    private _bonusKey: string;
    private _refs: {
        time: HTMLSpanElement;
        score: HTMLSpanElement;
        lives: HTMLSpanElement;
        root: HTMLDivElement;
        container: HTMLDivElement;
        stageOverlay: HTMLDivElement;
        stageText: HTMLSpanElement;
        bonusList: HTMLDivElement;
        bonusTemplate: HTMLTemplateElement;
    };

    constructor() {
        this._refs = {
            time: document.querySelector('#time'),
            score: document.querySelector('#score'),
            lives: document.querySelector('#lives'),
            root: document.querySelector('#root'),
            container: document.querySelector('#container'),
            stageOverlay: document.querySelector('#stageOverlay'),
            stageText: document.querySelector('#stageText'),
            bonusList: document.querySelector('#bonusList'),
            bonusTemplate: document.querySelector('#bonusTemplate')
        };

        this._refs.container.style.setProperty('--zoom', `${this._zoom}`);

        this.engine = new Phaser.Game(this.gameWidth * this.blockSize, this.gameHeight * this.blockSize, Phaser.AUTO, this._refs.root, {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }

    preload = () => {
        this.engine.stage.backgroundColor = '#1F8B00';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
            // Do Firefox-related activities
            this.engine.load.baseURL = './assets/';
            this.engine.load.crossOrigin = 'anonymous';
        }
        this.engine.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        this.engine.scale.pageAlignHorizontally = true;
        this.engine.scale.pageAlignVertically = true;
        this.engine.load.spritesheet('man', 'man.png', 16, 16, 21);
        this.engine.load.spritesheet('bomb', 'bomb.png', 16, 16, 3);
        this.engine.load.spritesheet('bum', 'bum.png', 16, 16, 36);
        this.engine.load.spritesheet('bum1', 'b1.png', 36, 12, 1);
        this.engine.load.spritesheet('mainWall', 'mainWall.png', 16, 16, 1);
        this.engine.load.spritesheet('wall', 'wall.png', 16, 16, 1);
        this.engine.load.spritesheet('wallDestroy', 'wallDestroy.png', 16, 16, 7);
        this.engine.load.spritesheet('bonuses', 'bonuses.png', 16, 16, 14);
        this.engine.load.spritesheet('door', 'door.png', 16, 16, 14);

        this.engine.load.spritesheet(Spooks.Balloom, `${Spooks.Balloom}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Oneal, `${Spooks.Oneal}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Doll, `${Spooks.Doll}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Minvo, `${Spooks.Minvo}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Kondoria, `${Spooks.Kondoria}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Ovapi, `${Spooks.Ovapi}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Pass, `${Spooks.Pass}.png`, 16, 16, 11);
        this.engine.load.spritesheet(Spooks.Pontan, `${Spooks.Pontan}.png`, 16, 16, 10);
    };

    render = () => {
        this._updateStatusBar();
    };

    create = () => {
        this.engine.physics.startSystem(Phaser.Physics.ARCADE);
        this.groups.walls = this.engine.add.group();
        this.groups.walls.enableBody = true;

        this.groups.wallsBrocken = this.engine.add.group();
        this.groups.wallsBrocken.enableBody = true;

        this.groups.bombsGroup = this.engine.add.group();
        this.groups.bombsGroup.enableBody = true;

        this.groups.bumGroup = this.engine.add.group();
        this.groups.bumGroup.enableBody = true;

        this.groups.mobWallCollideGroup = this.engine.add.group();
        this.groups.mobWallCollideGroup.enableBody = true;

        this.groups.mobGroup = this.engine.add.group();
        this.groups.mobGroup.enableBody = true;
        this.groups.mobGroup.add(this.groups.mobWallCollideGroup);

        this.door = new Door(this);

        buildMainWalls(this);
        this.newGame();
    };

    update = () => {
        this.engine.physics.arcade.collide(this.player.target, this.groups.walls);
        if (!this.player.skills.wallPass) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.wallsBrocken);
        }

        if (!this.player.skills.bombPass && !this.stage.isBonusStage) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.bombsGroup);
        }

        if (!this.player.skills.flamePass && !this.stage.isBonusStage) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.bumGroup, () => manDie(this));
        }

        if (!this.stage.isBonusStage) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.mobGroup, (man, mob) => manDie(this, mob));
        }

        if (!this.stage.isBonusStage) {
            this.engine.physics.arcade.collide(this.player.target, this.groups.mobWallCollideGroup, (man, mob) => manDie(this, mob));
        }

        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.walls);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bombsGroup);
        this.engine.physics.arcade.collide(this.groups.mobGroup, this.groups.bumGroup, (mob: Phaser.Sprite) => mobDie(this, mob));
        this.engine.physics.arcade.collide(this.groups.mobWallCollideGroup, this.groups.wallsBrocken);

        this.engine.physics.arcade.collide(this.groups.bumGroup, this.groups.wallsBrocken, (bum, wall) => destroyWall(this, wall));
        this.engine.physics.arcade.collide(this.groups.bumGroup, this.groups.bombsGroup, (bum, bomb) => detonateBombInChain(this, bomb));

        if (!this.stage.isBonusStage) {
            this.engine.physics.arcade.collide(this.groups.bumGroup, this.door.target, (bomb) => freeTheSpooks(this, bomb, 'door'));
            this.engine.physics.arcade.collide(this.groups.bumGroup, this.powerUp.target, (bonus) => freeTheSpooks(this, bonus, 'bonus'));
            if (checkCustomCollide(this.player.target, this.powerUp.target)) {
                manGetBonus(this);
            }

            if (checkCustomCollide(this.player.target, this.door.target)) {
                manWalksThroughTheDoor(this);
            }
        }


        this.player.update();
    };

    newGame() {
        if (this.player) {
            this.player.destroy();
        }

        // Создается игрок, происходить инициализация и привязка всех методов.
        this.player = new Man(this);
        this.engine.world.bringToTop(this.groups.walls);

        this.score = 0;
        this._level = 0;
        this._nextLevel();
        this._runTimer();
        this._bindKeyboard();
    }

    winLevel() {
        this._level++;
        this.player.lives++;
        this._nextStageWithAnimation(0);
    }

    losingLevel() {
        this.player.die();
        this._nextStageWithAnimation();
    }

    canFreeSpooks(type: string): boolean {
        if (!this._canFreeSpooks) {
            return false;
        }
        const canFree = type === 'door' ? this.door.opened() : this.powerUp.canDestroy();
        if (canFree) {
            this._canFreeSpooks = false;
            setTimeout(() => {
                this._canFreeSpooks = true;
            }, 500);
            return true;
        }
        return false;
    }

    private _runTimer() {
        this._stopTimer();

        this._timerId = setInterval(() => {
            this.time--;
            if (this.time === 0) {
                if (this.stage.isBonusStage) {
                    this.winLevel();
                } else {
                    this.losingLevel();
                }
            }
        }, 1000);
    }

    private _stopTimer() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = 0;
        }
    }

    private _nextStageWithAnimation(timeout= 3000) {
        this._stopTimer();
        setTimeout(() => {
            this._nextLevel();
            this.engine.paused = true;
            this._refs.stageOverlay.style.display = '';
            this._refs.stageText.textContent = this.stage.name;
            setTimeout(()=>{
                this._runTimer();
                this.engine.paused = false;
                this._refs.stageOverlay.style.display = 'none';
            }, 3000);
        }, timeout);
    }

    private _nextLevel() {
        if (this.player.lives === 0) {
            alert('Game over');
            this.newGame();
            return;
        }

        this.stage = getStageData(this._level);
        this.powerUp?.destroy();
        const destroy = (item) => item.destroy();
        this.blocks.forEach(destroy);
        this.mobs.forEach(destroy);
        this.bombs.forEach(destroy);

        this.time = this.stage.isBonusStage ? 30 : 180;
        this.blocks = [];
        this.mobs = [];
        this.bombs = [];
        buildLevel(this);
        this.player.comeToLife();
    }

    private _updateStatusBar(): void {
        if (this._prevTime !== this.time) {
            this._prevTime = this.time;
            this._refs.time.innerText = `${this.time}`;
            this._refs.score.innerText = `${this.score}`;
            this._refs.lives.innerText = `${this.player.lives}`;
            this._updateBonuses();
        }

        const containerWidth = this._refs.root.clientWidth;
        const gameWidth = this.gameWidth * this.blockSize * this._zoom;

        if (containerWidth < gameWidth) {
            const playerPosition = this.player.target.x * this._zoom;
            const maxScroll = gameWidth - containerWidth;
            const newScroll = Math.max(0, Math.min(maxScroll, playerPosition - containerWidth / 2));
            if (newScroll !== this._refs.root.scrollLeft) {
                this._refs.root.scrollLeft = newScroll;
            }
        } else if (this._refs.root.scrollLeft !== 0) {
            this._refs.root.scrollLeft = 0;
        }
    }

    private _bindKeyboard(): void {
        this.engine.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(() => {
            plantBomb(this);
        });
        this.engine.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(() => {
            plantBomb(this);
        });
        this.engine.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(() => {
            if (this.player.skills.detonator) {
                detonateAnOldBomb(this);
            }
        });
    }

    private _updateBonuses() {

        const bonusKey = [
            this.player.skills.bombs,
            this.player.skills.flames,
            this.player.skills.wallPass,
            this.player.skills.detonator,
            this.player.skills.bombPass,
            this.player.skills.flamePass,
            this.player.skills.mystery
        ].join();

        if (bonusKey !== this._bonusKey) {
            this._bonusKey = bonusKey;
            this._refs.bonusList.innerHTML = '';
            this._addBonus('0', `${this.player.skills.bombs}`);
            this._addBonus('1', `${this.player.skills.flames}`);
            if (this.player.skills.wallPass) {
                this._addBonus('3', '');
            }
            if (this.player.skills.detonator) {
                this._addBonus('4', '');
            }
            if (this.player.skills.bombPass) {
                this._addBonus('5', '');
            }
            if (this.player.skills.flamePass) {
                this._addBonus('6', '');
            }
            if (this.player.skills.mystery) {
                this._addBonus('7', '');
            }
        }
    }

    private _addBonus(id: string, text: string): void {
        const template = this._refs.bonusTemplate.content.cloneNode(true);
        // @ts-ignore
        template.firstElementChild.style.setProperty('--bonus-offset', id);
        // @ts-ignore
        template.querySelector('.bonuses-text').textContent = text;
        this._refs.bonusList.appendChild(template);
    }

}
